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
