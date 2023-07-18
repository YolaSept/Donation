// Kunin ang lahat ng mga link sa navigation menu
const navLinks = document.querySelectorAll('.Navigation a');

// I-loop ang bawat link at idagdag ang klase "active" kung ang link ay tumutukoy sa kasalukuyang URL
navLinks.forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add('active');
  }
});


