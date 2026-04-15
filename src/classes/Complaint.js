export class Complaint {
  constructor(id, raisedBy, against, reason, status = 'open') {
    this.id = id;
    this.raisedBy = raisedBy;
    this.against = against;
    this.reason = reason;
    this.status = status;
  }

  markUnderReview() {
    this.status = 'under review';
  }

  resolve() {
    this.status = 'resolved';
  }

  isOpen() {
    return this.status === 'open';
  }
}