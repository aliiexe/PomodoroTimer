document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const languageSelector = document.getElementById('language-selector');
  const languageSelector2 = document.getElementById('language-selector2');

  const savedLanguage = localStorage.getItem('language') || 'en';
  languageSelector.value = savedLanguage;
  setLanguage(savedLanguage);

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  document.querySelectorAll('.nav-link').forEach(link => 
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    })
  );

  languageSelector.addEventListener('change', (event) => {
    const selectedLanguage = event.target.value;
    localStorage.setItem('language', selectedLanguage);
    setLanguage(selectedLanguage);
  });

  languageSelector2.addEventListener('change', (event) => {
    const selectedLanguage = event.target.value;
    localStorage.setItem('language', selectedLanguage);
    setLanguage(selectedLanguage);
  });
});

function setLanguage(language) {
  const translations = {
    en: {
      signIn: 'Sign in',
      getDemo: 'Get demo',
      planTrackAchieve: 'Plan, Track and Achieve',
      allInOnePlace: 'all in one place',
      boostFocus: 'Boost focus, track goals, and master productivity.',
      getFreeDemo: 'Get a free demo',
      features: 'Features',
      pomodoroTimer: 'Pomodoro Timer',
      pomodoroDescription: 'Maximize your focus with timed work sessions and power through your tasks.',
      taskManagement: 'Task Management',
      taskManagementDescription: 'Take control of your day by organizing tasks and setting clear, achievable goals.',
      rewardSystem: 'Reward System',
      rewardSystemDescription: 'Stay motivated by earning rewards as you crush your goals and complete tasks.',
      pricing: 'Pricing',
      basicPlan: 'Basic Plan',
      basicPlanDescription: 'For personal productivity',
      perMonth: '/mo',
      accessPomodoro: '✔ Access to Pomodoro Timer',
      basicTaskManagement: '✔ Basic task management',
      singleDeviceAccess: '✔ Single device access',
      getStarted: 'Get started',
      proPlan: 'Pro Plan',
      proPlanDescription: 'For professionals',
      allBasicFeatures: '✔ All Basic Plan features',
      advancedTaskManagement: '✔ Advanced task management',
      multiDeviceSync: '✔ Multi-device sync',
      prioritySupport: '✔ Priority customer support',
      advancedPlan: 'Advanced Plan',
      advancedPlanDescription: 'For teams and businesses',
      allProFeatures: '✔ All Pro Plan features',
      teamCollaboration: '✔ Team collaboration tools',
      customWorkflows: '✔ Custom workflows',
      dedicatedManager: '✔ Dedicated account manager',
      testimonials: 'Testimonials',
      testimonial1: '"PeakFocus has transformed the way I work. The Pomodoro Timer keeps me focused and the reward system keeps me motivated."',
      testimonial1Name: 'John Doe',
      testimonial1Title: 'Product Manager',
      testimonial2: '"I love the task management features. It helps me stay organized and on top of my goals."',
      testimonial2Name: 'Jane Smith',
      testimonial2Title: 'Software Engineer',
      testimonial3: '"The team collaboration tools are fantastic. Our productivity has increased significantly since we started using PeakFocus."',
      testimonial3Name: 'Emily Johnson',
      testimonial3Title: 'Team Lead',
      readyToBoost: 'Ready to boost your productivity?',
      joinToday: 'Join PeakFocus today and start achieving your goals!',
      aboutUs: 'About Us',
      aboutUsDescription: 'PeakFocus is dedicated to helping you achieve your goals and boost your productivity with our innovative tools and features.',
      quickLinks: 'Quick Links',
      contactUs: 'Contact Us',
      email: 'Email: support@peakfocus.com',
      phone: 'Phone: +212 1 23 45 67 89',
      address: 'Address: 123 PeakFocus St, Productivity City, PC 12345'
    },
    fr: {
      signIn: 'Se connecter',
      getDemo: 'Obtenir une démo',
      planTrackAchieve: 'Planifiez, Suivez et Réalisez',
      allInOnePlace: 'tout en un seul endroit',
      boostFocus: 'Boostez votre concentration, suivez vos objectifs et maîtrisez votre productivité.',
      getFreeDemo: 'Obtenez une démo gratuite',
      features: 'Fonctionnalités',
      pomodoroTimer: 'Minuteur Pomodoro',
      pomodoroDescription: 'Maximisez votre concentration avec des sessions de travail chronométrées et accomplissez vos tâches.',
      taskManagement: 'Gestion des tâches',
      taskManagementDescription: 'Prenez le contrôle de votre journée en organisant les tâches et en définissant des objectifs clairs et réalisables.',
      rewardSystem: 'Système de récompense',
      rewardSystemDescription: 'Restez motivé en gagnant des récompenses en atteignant vos objectifs et en accomplissant des tâches.',
      pricing: 'Tarification',
      basicPlan: 'Plan de base',
      basicPlanDescription: 'Pour la productivité personnelle',
      perMonth: '/mois',
      accessPomodoro: '✔ Accès au minuteur Pomodoro',
      basicTaskManagement: '✔ Gestion des tâches de base',
      singleDeviceAccess: '✔ Accès sur un seul appareil',
      getStarted: 'Commencer',
      proPlan: 'Plan Pro',
      proPlanDescription: 'Pour les professionnels',
      allBasicFeatures: '✔ Toutes les fonctionnalités du plan de base',
      advancedTaskManagement: '✔ Gestion avancée des tâches',
      multiDeviceSync: '✔ Synchronisation multi-appareils',
      prioritySupport: '✔ Support client prioritaire',
      advancedPlan: 'Plan Avancé',
      advancedPlanDescription: 'Pour les équipes et les entreprises',
      allProFeatures: '✔ Toutes les fonctionnalités du plan Pro',
      teamCollaboration: '✔ Outils de collaboration en équipe',
      customWorkflows: '✔ Flux de travail personnalisés',
      dedicatedManager: '✔ Gestionnaire de compte dédié',
      testimonials: 'Témoignages',
      testimonial1: '"PeakFocus a transformé ma façon de travailler. Le minuteur Pomodoro me garde concentré et le système de récompense me motive."',
      testimonial1Name: 'John Doe',
      testimonial1Title: 'Chef de produit',
      testimonial2: '"J\'adore les fonctionnalités de gestion des tâches. Cela m\'aide à rester organisé et à atteindre mes objectifs."',
      testimonial2Name: 'Jane Smith',
      testimonial2Title: 'Ingénieur logiciel',
      testimonial3: '"Les outils de collaboration en équipe sont fantastiques. Notre productivité a considérablement augmenté depuis que nous utilisons PeakFocus."',
      testimonial3Name: 'Emily Johnson',
      testimonial3Title: 'Chef d\'équipe',
      readyToBoost: 'Prêt à booster votre productivité ?',
      joinToday: 'Rejoignez PeakFocus aujourd\'hui et commencez à atteindre vos objectifs !',
      aboutUs: 'À propos de nous',
      aboutUsDescription: 'PeakFocus est dédié à vous aider à atteindre vos objectifs et à augmenter votre productivité avec nos outils et fonctionnalités innovants.',
      quickLinks: 'Liens rapides',
      contactUs: 'Contactez-nous',
      email: 'Email : support@peakfocus.com',
      phone: 'Téléphone : +212 1 23 45 67 89',
      address: 'Adresse : 123 PeakFocus St, Productivity City, PC 12345'
    }
  };

  document.querySelector('.auth-links a[href="./login.html"]').textContent = translations[language].signIn;
  document.querySelector('.auth-links a[href="./signup.html"]').textContent = translations[language].getDemo;
  document.querySelector('.hero h1').textContent = translations[language].planTrackAchieve;
  document.querySelector('.hero h2').textContent = translations[language].allInOnePlace;
  document.querySelector('.hero p').textContent = translations[language].boostFocus;
  document.querySelector('.content a').textContent = translations[language].getFreeDemo;
  document.querySelector('.features-section .inline-block').textContent = translations[language].features;
  document.querySelector('.feature-box:nth-child(1) h3').textContent = translations[language].pomodoroTimer;
  document.querySelector('.feature-box:nth-child(1) p').textContent = translations[language].pomodoroDescription;
  document.querySelector('.feature-box:nth-child(2) h3').textContent = translations[language].taskManagement;
  document.querySelector('.feature-box:nth-child(2) p').textContent = translations[language].taskManagementDescription;
  document.querySelector('.feature-box:nth-child(3) h3').textContent = translations[language].rewardSystem;
  document.querySelector('.feature-box:nth-child(3) p').textContent = translations[language].rewardSystemDescription;
  document.querySelector('.pricing-section .inline-block').textContent = translations[language].pricing;
  document.querySelector('.pricing-card:nth-child(1) h3').textContent = translations[language].basicPlan;
  document.querySelector('.pricing-card:nth-child(1) p').textContent = translations[language].basicPlanDescription;
  document.querySelector('.pricing-card:nth-child(1) .text-4xl').innerHTML = `$5<span class="text-lg font-medium">${translations[language].perMonth}</span>`;
  document.querySelector('.pricing-card:nth-child(1) ul li:nth-child(1)').textContent = translations[language].accessPomodoro;
  document.querySelector('.pricing-card:nth-child(1) ul li:nth-child(2)').textContent = translations[language].basicTaskManagement;
  document.querySelector('.pricing-card:nth-child(1) ul li:nth-child(3)').textContent = translations[language].singleDeviceAccess;
  document.querySelector('.pricing-card:nth-child(1) button').textContent = translations[language].getStarted;
  document.querySelector('.pricing-card:nth-child(2) h3').textContent = translations[language].proPlan;
  document.querySelector('.pricing-card:nth-child(2) p').textContent = translations[language].proPlanDescription;
  document.querySelector('.pricing-card:nth-child(2) .text-4xl').innerHTML = `$9<span class="text-lg font-medium">${translations[language].perMonth}</span>`;
  document.querySelector('.pricing-card:nth-child(2) ul li:nth-child(1)').textContent = translations[language].allBasicFeatures;
  document.querySelector('.pricing-card:nth-child(2) ul li:nth-child(2)').textContent = translations[language].advancedTaskManagement;
  document.querySelector('.pricing-card:nth-child(2) ul li:nth-child(3)').textContent = translations[language].multiDeviceSync;
  document.querySelector('.pricing-card:nth-child(2) ul li:nth-child(4)').textContent = translations[language].prioritySupport;
  document.querySelector('.pricing-card:nth-child(2) button').textContent = translations[language].getStarted;
  document.querySelector('.pricing-card:nth-child(3) h3').textContent = translations[language].advancedPlan;
  document.querySelector('.pricing-card:nth-child(3) p').textContent = translations[language].advancedPlanDescription;
  document.querySelector('.pricing-card:nth-child(3) .text-4xl').innerHTML = `$15<span class="text-lg font-medium">${translations[language].perMonth}</span>`;
  document.querySelector('.pricing-card:nth-child(3) ul li:nth-child(1)').textContent = translations[language].allProFeatures;
  document.querySelector('.pricing-card:nth-child(3) ul li:nth-child(2)').textContent = translations[language].teamCollaboration;
  document.querySelector('.pricing-card:nth-child(3) ul li:nth-child(3)').textContent = translations[language].customWorkflows;
  document.querySelector('.pricing-card:nth-child(3) ul li:nth-child(4)').textContent = translations[language].dedicatedManager;
  document.querySelector('.pricing-card:nth-child(3) button').textContent = translations[language].getStarted;
  document.querySelector('.testimonials-section .inline-block').textContent = translations[language].testimonials;
  document.querySelector('.testimonial-card:nth-child(1) p').textContent = translations[language].testimonial1;
  document.querySelector('.testimonial-card:nth-child(1) h3').textContent = translations[language].testimonial1Name;
  document.querySelector('.testimonial-card:nth-child(1) p:nth-child(3)').textContent = translations[language].testimonial1Title;
  document.querySelector('.testimonial-card:nth-child(2) p').textContent = translations[language].testimonial2;
  document.querySelector('.testimonial-card:nth-child(2) h3').textContent = translations[language].testimonial2Name;
  document.querySelector('.testimonial-card:nth-child(2) p:nth-child(3)').textContent = translations[language].testimonial2Title;
  document.querySelector('.testimonial-card:nth-child(3) p').textContent = translations[language].testimonial3;
  document.querySelector('.testimonial-card:nth-child(3) h3').textContent = translations[language].testimonial3Name;
  document.querySelector('.testimonial-card:nth-child(3) p:nth-child(3)').textContent = translations[language].testimonial3Title;
  document.querySelector('.cta-section h2').textContent = translations[language].readyToBoost;
  document.querySelector('.cta-section p').textContent = translations[language].joinToday;
  document.querySelector('.cta-section a').textContent = translations[language].getStarted;
  document.querySelector('.footer-section .footer-column:nth-child(1) h3').textContent = translations[language].aboutUs;
  document.querySelector('.footer-section .footer-column:nth-child(1) p').textContent = translations[language].aboutUsDescription;
  document.querySelector('.footer-section .footer-column:nth-child(2) h3').textContent = translations[language].quickLinks;
  document.querySelector('.footer-section .footer-column:nth-child(2) ul li:nth-child(1) a').textContent = translations[language].signIn;
  document.querySelector('.footer-section .footer-column:nth-child(2) ul li:nth-child(2) a').textContent = translations[language].getDemo;
  document.querySelector('.footer-section .footer-column:nth-child(2) ul li:nth-child(3) a').textContent = translations[language].features;
  document.querySelector('.footer-section .footer-column:nth-child(2) ul li:nth-child(4) a').textContent = translations[language].pricing;
  document.querySelector('.footer-section .footer-column:nth-child(3) h3').textContent = translations[language].contactUs;
  document.querySelector('.footer-section .footer-column:nth-child(3) p:nth-child(2)').textContent = translations[language].email;
  document.querySelector('.footer-section .footer-column:nth-child(3) p:nth-child(3)').textContent = translations[language].phone;
  document.querySelector('.footer-section .footer-column:nth-child(3) p:nth-child(4)').textContent = translations[language].address;
}