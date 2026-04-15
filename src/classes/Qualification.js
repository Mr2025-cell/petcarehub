export class Qualification {
  constructor(id, caregiverName, type, submittedDate, status = 'pending') {
    this.id = id;
    this.caregiverName = caregiverName;
    this.type = type;
    this.submittedDate = submittedDate;
    this.status = status;
  }

  approve() {
    this.status = 'approved';
  }

  reject() {
    this.status = 'rejected';
  }

  isPending() {
    return this.status === 'pending';
  }
}