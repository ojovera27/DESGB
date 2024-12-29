;; Conservation Fund Contract

(define-fungible-token conservation-token)

(define-map projects
  { project-id: uint }
  {
    name: (string-ascii 100),
    description: (string-utf8 500),
    funding-goal: uint,
    current-funding: uint,
    creator: principal
  }
)

(define-data-var last-project-id uint u0)

(define-public (create-project (name (string-ascii 100)) (description (string-utf8 500)) (funding-goal uint))
  (let
    (
      (new-project-id (+ (var-get last-project-id) u1))
    )
    (map-set projects
      { project-id: new-project-id }
      {
        name: name,
        description: description,
        funding-goal: funding-goal,
        current-funding: u0,
        creator: tx-sender
      }
    )
    (var-set last-project-id new-project-id)
    (ok new-project-id)
  )
)

(define-public (fund-project (project-id uint) (amount uint))
  (let
    (
      (project (unwrap! (map-get? projects { project-id: project-id }) (err u404)))
      (new-funding (+ (get current-funding project) amount))
    )
    (try! (ft-transfer? conservation-token amount tx-sender (as-contract tx-sender)))
    (map-set projects
      { project-id: project-id }
      (merge project { current-funding: new-funding })
    )
    (ok new-funding)
  )
)

(define-public (withdraw-funds (project-id uint) (amount uint))
  (let
    (
      (project (unwrap! (map-get? projects { project-id: project-id }) (err u404)))
    )
    (asserts! (is-eq (get creator project) tx-sender) (err u403))
    (asserts! (<= amount (get current-funding project)) (err u401))
    (try! (as-contract (ft-transfer? conservation-token amount tx-sender (get creator project))))
    (map-set projects
      { project-id: project-id }
      (merge project { current-funding: (- (get current-funding project) amount) })
    )
    (ok true)
  )
)

(define-read-only (get-project (project-id uint))
  (ok (map-get? projects { project-id: project-id }))
)

(define-read-only (get-token-balance (account principal))
  (ok (ft-get-balance conservation-token account))
)

