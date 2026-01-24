;; SwiftPay Engine
(use-trait sip-010 .sip-010-trait.sip-010-trait)
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-INVALID-PARAMS (err u101))
(define-constant ERR-STREAM-NOT-FOUND (err u102))
(define-constant ERR-STREAM-CANCELLED (err u103))
(define-constant CONTRACT-OWNER tx-sender)
(define-data-var next-stream-id uint u0)
(define-data-var is-paused bool false)
(define-map streams uint {
    sender: principal,
    token-contract: (optional principal),
    amount-total: uint,
    amount-withdrawn: uint,
    start-block: uint,
    stop-block: uint,
    is-cancelled: bool
})
(define-read-only (get-stream (stream-id uint)) (map-get? streams stream-id))
(define-read-only (get-recipient (stream-id uint)) (contract-call? .swift-pay-nft get-owner stream-id))
(define-read-only (calculate-earned (stream-id uint))
    (let (
        (stream (unwrap! (map-get? streams stream-id) ERR-STREAM-NOT-FOUND))
        (current-height block-height)
    )
    (if (<= current-height (get start-block stream))
        (ok u0)
        (if (>= current-height (get stop-block stream))
            (ok (get amount-total stream))
            (let (
                (duration (- (get stop-block stream) (get start-block stream)))
                (elapsed (- current-height (get start-block stream)))
                (earned (/ (* (get amount-total stream) elapsed) duration))
            )
            (ok earned))
        )
    )
    )
)
(define-public (create-stx-stream (recipient principal) (amount uint) (start-block uint) (stop-block uint))
    (let (
        (stream-id (var-get next-stream-id))
        (contract-addr (as-contract tx-sender))
    )
        (asserts! (not (var-get is-paused)) (err u105))
        (asserts! (> amount u0) ERR-INVALID-PARAMS)
        (asserts! (> stop-block start-block) ERR-INVALID-PARAMS)
        (asserts! (>= start-block block-height) ERR-INVALID-PARAMS)
        (try! (stx-transfer? amount tx-sender contract-addr))
        (map-set streams stream-id {
            sender: tx-sender,
            token-contract: none,
            amount-total: amount,
            amount-withdrawn: u0,
            start-block: start-block,
            stop-block: stop-block,
            is-cancelled: false
        })
        (try! (contract-call? .swift-pay-nft mint recipient stream-id))
        (var-set next-stream-id (+ stream-id u1))
        (ok stream-id)
    )
)
(define-public (create-ft-stream (token <sip-010>) (recipient principal) (amount uint) (start-block uint) (stop-block uint))
    (let (
        (stream-id (var-get next-stream-id))
        (contract-addr (as-contract tx-sender))
        (token-addr (contract-of token))
    )
        (asserts! (not (var-get is-paused)) (err u105))
        (asserts! (> amount u0) ERR-INVALID-PARAMS)
        (try! (contract-call? token transfer amount tx-sender contract-addr none))
        (map-set streams stream-id {
            sender: tx-sender,
            token-contract: (some token-addr),
            amount-total: amount,
            amount-withdrawn: u0,
            start-block: start-block,
            stop-block: stop-block,
            is-cancelled: false
        })
        (try! (contract-call? .swift-pay-nft mint recipient stream-id))
        (var-set next-stream-id (+ stream-id u1))
        (ok stream-id)
    )
)
(define-public (withdraw (stream-id uint) (token-opt (optional <sip-010>)))
    (let (
        (stream (unwrap! (map-get? streams stream-id) ERR-STREAM-NOT-FOUND))
        (recipient (unwrap! (unwrap! (get-recipient stream-id) ERR-STREAM-NOT-FOUND) ERR-NOT-AUTHORIZED))
        (earned (unwrap! (calculate-earned stream-id) ERR-STREAM-NOT-FOUND))
        (withdrawable (- earned (get amount-withdrawn stream)))
    )
        (asserts! (not (get is-cancelled stream)) ERR-STREAM-CANCELLED)
        (asserts! (is-eq tx-sender recipient) ERR-NOT-AUTHORIZED)
        (asserts! (> withdrawable u0) (err u104))
        (map-set streams stream-id (merge stream { amount-withdrawn: earned }))
        (match (get token-contract stream)
            t-addr (let ((token (unwrap! token-opt ERR-INVALID-PARAMS)))
                (asserts! (is-eq (contract-of token) t-addr) ERR-INVALID-PARAMS)
                (try! (as-contract (contract-call? token transfer withdrawable tx-sender recipient none)))
            )
            (try! (as-contract (stx-transfer? withdrawable tx-sender recipient)))
        )
        (ok withdrawable)
    )
)
(define-public (cancel (stream-id uint) (token-opt (optional <sip-010>)))
    (let (
        (stream (unwrap! (map-get? streams stream-id) ERR-STREAM-NOT-FOUND))
        (sender (get sender stream))
        (recipient (unwrap! (unwrap! (get-recipient stream-id) ERR-STREAM-NOT-FOUND) ERR-NOT-AUTHORIZED))
        (earned (unwrap! (calculate-earned stream-id) ERR-STREAM-NOT-FOUND))
        (remaining (- (get amount-total stream) earned))
        (to-recipient (- earned (get amount-withdrawn stream)))
    )
        (asserts! (or (is-eq tx-sender sender) (is-eq tx-sender recipient)) ERR-NOT-AUTHORIZED)
        (asserts! (not (get is-cancelled stream)) ERR-STREAM-CANCELLED)
        (map-set streams stream-id (merge stream { is-cancelled: true, amount-withdrawn: earned }))
        (match (get token-contract stream)
            t-addr (let ((token (unwrap! token-opt ERR-INVALID-PARAMS)))
                (if (> to-recipient u0) (try! (as-contract (contract-call? token transfer to-recipient tx-sender recipient none))) true)
                (if (> remaining u0) (try! (as-contract (contract-call? token transfer remaining tx-sender sender none))) true)
            )
            (begin
                (if (> to-recipient u0) (try! (as-contract (stx-transfer? to-recipient tx-sender recipient))) true)
                (if (> remaining u0) (try! (as-contract (stx-transfer? remaining tx-sender sender))) true)
            )
        )
        (try! (contract-call? .swift-pay-nft burn stream-id))
        (ok true)
    )
)
