export class Rating {
  constructor(id, reviewerName, caregiverName, score, comment, status = 'visible') {
    this.id = id;
    this.reviewerName = reviewerName;
    this.caregiverName = caregiverName;
    this.score = score;
    this.comment = comment;
    this.status = status;
  }

  hide() {
    this.status = 'hidden';
  }

  restore() {
    this.status = 'visible';
  }

  isVisible() {
    return this.status === 'visible';
  }
}