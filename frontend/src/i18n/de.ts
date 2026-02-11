// Deutsche Übersetzungen für die Anwendung
export const de = {
  // Allgemeine Begriffe
  common: {
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    add: 'Hinzufügen',
    search: 'Suchen',
    filter: 'Filtern',
    loading: 'Lädt...',
    error: 'Fehler',
    success: 'Erfolg',
    confirm: 'Bestätigen',
    back: 'Zurück',
    next: 'Weiter',
    submit: 'Absenden',
    close: 'Schließen',
    view: 'Ansehen',
    download: 'Herunterladen',
    upload: 'Hochladen',
    required: 'Erforderlich',
    optional: 'Optional',
    all: 'Alle',
  },

  // Authentifizierung
  auth: {
    signIn: 'Anmelden',
    signUp: 'Registrieren',
    signOut: 'Abmelden',
    email: 'E-Mail',
    password: 'Passwort',
    confirmPassword: 'Passwort bestätigen',
    forgotPassword: 'Passwort vergessen?',
    rememberMe: 'Angemeldet bleiben',
    continueWithGoogle: 'Mit Google fortfahren',
    orContinueWith: 'Oder fortfahren mit',
    alreadyHaveAccount: 'Haben Sie bereits ein Konto?',
    dontHaveAccount: 'Noch kein Konto?',
    createAccount: 'Konto erstellen',
    welcomeBack: 'Willkommen zurück',
    getStarted: 'Jetzt starten',
    loginSuccess: 'Erfolgreich angemeldet',
    loginError: 'Anmeldung fehlgeschlagen',
    signupSuccess: 'Konto erfolgreich erstellt',
    signupError: 'Registrierung fehlgeschlagen',
    invalidCredentials: 'Ungültige Anmeldedaten',
    emailRequired: 'E-Mail ist erforderlich',
    passwordRequired: 'Passwort ist erforderlich',
    passwordTooShort: 'Passwort muss mindestens 12 Zeichen lang sein',
    passwordMismatch: 'Passwörter stimmen nicht überein',
  },

  // Navigation
  nav: {
    home: 'Startseite',
    dashboard: 'Dashboard',
    jobTracker: 'Bewerbungs-Tracker',
    interviews: 'Vorstellungsgespräche',
    networking: 'Netzwerken',
    calendar: 'Kalender',
    fiftyDayPlan: '50-Tage-Plan',
    interviewPractice: 'Interview-Übung',
    settings: 'Einstellungen',
    profile: 'Profil',
    security: 'Sicherheit',
    privacy: 'Datenschutz',
    admin: 'Administration',
  },

  // Bewerbungs-Tracker
  jobTracker: {
    title: 'Bewerbungs-Tracker',
    description: 'Verwalten und verfolgen Sie Ihre Bewerbungen',
    addApplication: 'Bewerbung hinzufügen',
    editApplication: 'Bewerbung bearbeiten',
    deleteApplication: 'Bewerbung löschen',
    companyName: 'Firmenname',
    jobTitle: 'Stellenbezeichnung',
    jobUrl: 'Stellen-URL',
    status: 'Status',
    appliedDate: 'Bewerbungsdatum',
    salaryRange: 'Gehaltsrahmen',
    location: 'Standort',
    notes: 'Notizen',
    followUpDate: 'Nachfassdatum',
    
    // Status-Werte
    statusApplied: 'Beworben',
    statusScreening: 'Prüfung',
    statusInterview: 'Vorstellungsgespräch',
    statusOffer: 'Angebot',
    statusRejected: 'Abgelehnt',
    statusWithdrawn: 'Zurückgezogen',
    
    // Platzhalter
    companyNamePlaceholder: 'z.B. SAP AG',
    jobTitlePlaceholder: 'z.B. Senior Software Engineer',
    jobUrlPlaceholder: 'https://...',
    salaryRangePlaceholder: 'z.B. 60.000 € - 80.000 €',
    locationPlaceholder: 'z.B. Stuttgart, Deutschland',
    notesPlaceholder: 'Zusätzliche Informationen zur Bewerbung...',
    
    // Nachrichten
    applicationAdded: 'Bewerbung erfolgreich hinzugefügt',
    applicationUpdated: 'Bewerbung erfolgreich aktualisiert',
    applicationDeleted: 'Bewerbung gelöscht',
    loadError: 'Fehler beim Laden der Bewerbungen',
    saveError: 'Fehler beim Speichern der Bewerbung',
    deleteError: 'Fehler beim Löschen der Bewerbung',
    deleteConfirm: 'Möchten Sie diese Bewerbung wirklich löschen?',
    
    // Statistiken
    totalApplications: 'Bewerbungen gesamt',
    activeApplications: 'Aktive Bewerbungen',
    interviews: 'Vorstellungsgespräche',
    offers: 'Angebote',
  },

  // Onboarding
  onboarding: {
    title: 'Willkommen! Lassen Sie uns Ihr Profil einrichten',
    description: 'Erzählen Sie uns etwas über Ihre Jobsuche',
    fullName: 'Vollständiger Name',
    fullNamePlaceholder: 'Max Mustermann',
    currentTitle: 'Aktuelle Berufsbezeichnung',
    currentTitlePlaceholder: 'z.B. Software Engineer',
    yearsOfExperience: 'Jahre Berufserfahrung',
    yearsPlaceholder: 'z.B. 5',
    targetRole: 'Angestrebte Position',
    targetRolePlaceholder: 'z.B. Senior Software Engineer',
    locationPreference: 'Standortpräferenz',
    locationPreferencePlaceholder: 'z.B. Stuttgart, Deutschland oder Überall',
    workType: 'Arbeitsmodell',
    workTypeRemote: 'Remote',
    workTypeHybrid: 'Hybrid',
    workTypeOnsite: 'Vor Ort',
    salaryExpectation: 'Gehaltsvorstellung',
    salaryPlaceholder: 'z.B. 70.000 €',
    skills: 'Fähigkeiten',
    skillsPlaceholder: 'z.B. React, TypeScript, Node.js',
    linkedinUrl: 'LinkedIn-Profil',
    linkedinPlaceholder: 'https://linkedin.com/in/ihr-profil',
    portfolioUrl: 'Portfolio/Website',
    portfolioPlaceholder: 'https://ihr-portfolio.de',
    completeProfile: 'Profil vervollständigen',
    profileSaved: 'Profil erfolgreich gespeichert',
    profileError: 'Fehler beim Speichern des Profils',
  },

  // Dashboard
  dashboard: {
    title: 'Dashboard',
    welcome: 'Willkommen zurück',
    overview: 'Übersicht',
    recentActivity: 'Letzte Aktivitäten',
    upcomingInterviews: 'Anstehende Vorstellungsgespräche',
    quickActions: 'Schnellaktionen',
    statistics: 'Statistiken',
    noData: 'Keine Daten verfügbar',
  },

  // Vorstellungsgespräche
  interviews: {
    title: 'Vorstellungsgespräche',
    description: 'Verwalten Sie Ihre Vorstellungsgespräche',
    addInterview: 'Vorstellungsgespräch hinzufügen',
    editInterview: 'Vorstellungsgespräch bearbeiten',
    deleteInterview: 'Vorstellungsgespräch löschen',
    company: 'Firma',
    position: 'Position',
    date: 'Datum',
    time: 'Uhrzeit',
    type: 'Typ',
    typePhone: 'Telefon',
    typeVideo: 'Video',
    typeOnsite: 'Vor Ort',
    interviewer: 'Interviewer',
    location: 'Standort',
    notes: 'Notizen',
    preparation: 'Vorbereitung',
    outcome: 'Ergebnis',
    
    // Platzhalter
    companyPlaceholder: 'z.B. SAP AG',
    positionPlaceholder: 'z.B. Software Engineer',
    interviewerPlaceholder: 'Name des Interviewers',
    locationPlaceholder: 'Büroadresse',
    notesPlaceholder: 'Notizen zum Vorstellungsgespräch...',
    
    // Nachrichten
    interviewAdded: 'Vorstellungsgespräch hinzugefügt',
    interviewUpdated: 'Vorstellungsgespräch aktualisiert',
    interviewDeleted: 'Vorstellungsgespräch gelöscht',
    loadError: 'Fehler beim Laden der Vorstellungsgespräche',
    saveError: 'Fehler beim Speichern',
    deleteError: 'Fehler beim Löschen',
    deleteConfirm: 'Möchten Sie dieses Vorstellungsgespräch wirklich löschen?',
  },

  // Netzwerken
  networking: {
    title: 'Netzwerk-Kontakte',
    description: 'Verwalten Sie Ihre beruflichen Kontakte',
    addContact: 'Kontakt hinzufügen',
    editContact: 'Kontakt bearbeiten',
    deleteContact: 'Kontakt löschen',
    name: 'Name',
    company: 'Firma',
    position: 'Position',
    email: 'E-Mail',
    phone: 'Telefon',
    linkedIn: 'LinkedIn',
    notes: 'Notizen',
    lastContact: 'Letzter Kontakt',
    
    // Platzhalter
    namePlaceholder: 'Max Mustermann',
    companyPlaceholder: 'z.B. SAP AG',
    positionPlaceholder: 'z.B. Recruiting Manager',
    emailPlaceholder: 'max@beispiel.de',
    phonePlaceholder: '+49 123 456 7890',
    linkedInPlaceholder: 'https://linkedin.com/in/profil',
    notesPlaceholder: 'Notizen zum Kontakt...',
    
    // Nachrichten
    contactAdded: 'Kontakt hinzugefügt',
    contactUpdated: 'Kontakt aktualisiert',
    contactDeleted: 'Kontakt gelöscht',
    loadError: 'Fehler beim Laden der Kontakte',
    saveError: 'Fehler beim Speichern',
    deleteError: 'Fehler beim Löschen',
    deleteConfirm: 'Möchten Sie diesen Kontakt wirklich löschen?',
  },

  // Kalender
  calendar: {
    title: 'Kalender',
    description: 'Verwalten Sie Ihre Termine',
    addEvent: 'Termin hinzufügen',
    editEvent: 'Termin bearbeiten',
    deleteEvent: 'Termin löschen',
    today: 'Heute',
    week: 'Woche',
    month: 'Monat',
    day: 'Tag',
    noEvents: 'Keine Termine',
  },

  // 50-Tage-Plan
  fiftyDayPlan: {
    title: '50-Tage-Jobsuche-Plan',
    description: 'Ihr strukturierter Weg zum neuen Job',
    day: 'Tag',
    week: 'Woche',
    completed: 'Abgeschlossen',
    inProgress: 'In Bearbeitung',
    notStarted: 'Nicht begonnen',
    markComplete: 'Als abgeschlossen markieren',
    markIncomplete: 'Als nicht abgeschlossen markieren',
  },

  // Einstellungen
  settings: {
    title: 'Einstellungen',
    profile: 'Profil',
    security: 'Sicherheit',
    privacy: 'Datenschutz',
    notifications: 'Benachrichtigungen',
    language: 'Sprache',
    theme: 'Design',
    saveChanges: 'Änderungen speichern',
    changesSaved: 'Änderungen gespeichert',
    saveError: 'Fehler beim Speichern',
  },

  // Sicherheit
  security: {
    title: 'Sicherheitseinstellungen',
    changePassword: 'Passwort ändern',
    currentPassword: 'Aktuelles Passwort',
    newPassword: 'Neues Passwort',
    confirmNewPassword: 'Neues Passwort bestätigen',
    twoFactor: 'Zwei-Faktor-Authentifizierung',
    enable2FA: '2FA aktivieren',
    disable2FA: '2FA deaktivieren',
    sessions: 'Aktive Sitzungen',
    revokeSession: 'Sitzung widerrufen',
    passwordChanged: 'Passwort erfolgreich geändert',
    passwordError: 'Fehler beim Ändern des Passworts',
  },

  // Admin
  admin: {
    title: 'Administration',
    users: 'Benutzer',
    settings: 'Einstellungen',
    logs: 'Protokolle',
    statistics: 'Statistiken',
  },

  // Fehler
  errors: {
    generic: 'Ein Fehler ist aufgetreten',
    network: 'Netzwerkfehler',
    unauthorized: 'Nicht autorisiert',
    forbidden: 'Zugriff verweigert',
    notFound: 'Nicht gefunden',
    serverError: 'Serverfehler',
    tryAgain: 'Bitte versuchen Sie es erneut',
  },

  // Validierung
  validation: {
    required: 'Dieses Feld ist erforderlich',
    invalidEmail: 'Ungültige E-Mail-Adresse',
    invalidPhone: 'Ungültige Telefonnummer',
    invalidUrl: 'Ungültige URL',
    minLength: 'Mindestens {min} Zeichen erforderlich',
    maxLength: 'Maximal {max} Zeichen erlaubt',
    passwordRequirements: 'Passwort muss mindestens 12 Zeichen, einen Großbuchstaben, einen Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten',
  },
};

export default de;
