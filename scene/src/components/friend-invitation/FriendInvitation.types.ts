export type Invitation = {
    id: string
    status: 'sent' | 'received'
    message: string
    date: string
  }