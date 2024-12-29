;; Genome NFT Contract

(define-non-fungible-token genome uint)

(define-data-var last-token-id uint u0)

(define-map token-metadata
  { token-id: uint }
  {
    species: (string-ascii 100),
    sequence-hash: (buff 32),
    collection-date: uint,
    location: (string-ascii 100)
  }
)

(define-public (mint-genome-nft (species (string-ascii 100)) (sequence-hash (buff 32)) (collection-date uint) (location (string-ascii 100)))
  (let
    (
      (new-token-id (+ (var-get last-token-id) u1))
    )
    (try! (nft-mint? genome new-token-id tx-sender))
    (map-set token-metadata
      { token-id: new-token-id }
      {
        species: species,
        sequence-hash: sequence-hash,
        collection-date: collection-date,
        location: location
      }
    )
    (var-set last-token-id new-token-id)
    (ok new-token-id)
  )
)

(define-public (transfer-genome-nft (token-id uint) (recipient principal))
  (nft-transfer? genome token-id tx-sender recipient)
)

(define-read-only (get-genome-metadata (token-id uint))
  (ok (map-get? token-metadata { token-id: token-id }))
)

(define-read-only (get-owner (token-id uint))
  (ok (nft-get-owner? genome token-id))
)

