export class Admin {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = 'admin';
  }

  approveQualification(qualification) {
    qualification.approve();
    return qualification;
  }

  rejectQualification(qualification) {
    qualification.reject();
    return qualification;
  }

  markComplaintUnderReview(complaint) {
    complaint.markUnderReview();
    return complaint;
  }

  resolveComplaint(complaint) {
    complaint.resolve();
    return complaint;
  }

  hideRating(rating) {
    rating.hide();
    return rating;
  }

  restoreRating(rating) {
    rating.restore();
    return rating;
  }
}