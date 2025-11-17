import { PatientEncounter } from "@/pageObject/Patients/PatientEncounter";
import { PatientNotes } from "@/pageObject/Patients/PatientNotes";
import { UserProfile } from "@/pageObject/Users/UserProfile";
import { FacilityCreation } from "@/pageObject/facility/FacilityCreation";
import { generatePhoneNumber } from "@/utils/commonUtils";
import { viewPort } from "@/utils/viewPort";

const patientEncounter = new PatientEncounter();
const facilityCreation = new FacilityCreation();
const patientNotes = new PatientNotes();
const userProfile = new UserProfile();

describe("Encounter Notes vs Patient Notes Isolation", () => {
  beforeEach(() => {
    cy.viewport(viewPort.desktop1080p.width, viewPort.desktop1080p.height);
    cy.loginByApi("doctor");
    cy.visit("/");
    facilityCreation.selectFirstRandomFacility();
    patientEncounter
      .navigateToEncounters()
      .clickInProgressEncounterFilter()
      .openFirstEncounterDetails();
  });

  it("should ensure encounter notes do not appear in patient notes", () => {
    const encounterThreadTitle = `Encounter Thread - ${generatePhoneNumber()}`;
    const encounterMessage = "This is an encounter-specific note";

    // Create an encounter note
    patientNotes
      .openEncounterNotesTab()
      .clickNewThreadButton()
      .typeThreadTitle(encounterThreadTitle)
      .clickCreateThreadButton()
      .addNewChatMessages([encounterMessage])
      .verifyMessagesInChat([encounterMessage]);

    // Navigate to patient notes and verify encounter note does NOT appear
    patientEncounter.clickPatientDetailsButton();
    patientNotes
      .openPatientNotesTab()
      .verifyThreadDoesNotExist(encounterThreadTitle);
  });

  it("should ensure patient notes do not appear in encounter notes", () => {
    const patientThreadTitle = `Patient Thread - ${generatePhoneNumber()}`;
    const patientMessage = "This is a patient-level note";

    // Navigate to patient notes first
    patientEncounter.clickPatientDetailsButton();
    patientNotes
      .openPatientNotesTab()
      .clickNewThreadButton()
      .typeThreadTitle(patientThreadTitle)
      .clickCreateThreadButton()
      .addNewChatMessages([patientMessage])
      .verifyMessagesInChat([patientMessage])
      .saveCurrentUrl();

    // Navigate back to encounter notes and verify patient note does NOT appear
    cy.go("back");
    cy.go("back");
    patientNotes
      .openEncounterNotesTab()
      .verifyThreadDoesNotExist(patientThreadTitle);
  });
});

describe("Thread Messaging - Multi-user & Single-user", () => {
  beforeEach(() => {
    cy.viewport(viewPort.desktop1080p.width, viewPort.desktop1080p.height);
    cy.loginByApi("doctor");
    cy.visit("/");
    facilityCreation.selectFirstRandomFacility();
    patientEncounter
      .navigateToEncounters()
      .clickInProgressEncounterFilter()
      .openFirstEncounterDetails();
  });

  it("should allow multiple users to send messages in the same thread", () => {
    const threadTitle = `Multi-user Thread - ${generatePhoneNumber()}`;
    const userAMessage = "Message from User A";
    const userBMessage = "Message from User B";

    // User A creates thread and sends message
    patientNotes
      .openEncounterNotesTab()
      .clickNewThreadButton()
      .typeThreadTitle(threadTitle)
      .clickCreateThreadButton()
      .addNewChatMessages([userAMessage])
      .verifyMessagesInChat([userAMessage])
      .saveCurrentUrl();

    // Switch to User B
    userProfile.openUserMenu().clickUserLogout();
    cy.loginByApi("nurse");

    // User B sends message in same thread
    patientNotes
      .navigateToSavedUrl()
      .verifyMessagesInChat([userAMessage])
      .addNewChatMessages([userBMessage])
      .verifyMessagesInChat([userAMessage, userBMessage]);

    // Switch back to User A and verify both messages
    userProfile.openUserMenu().clickUserLogout();
    cy.loginByApi("doctor");
    patientNotes
      .navigateToSavedUrl()
      .verifyMessagesInChat([userAMessage, userBMessage]);
  });

  it("should display multiple consecutive messages from single user in correct order", () => {
    const threadTitle = `Single-user Thread - ${generatePhoneNumber()}`;
    const messages = [
      "First message from user",
      "Second message from user",
      "Third message from user",
      "Fourth message from user",
    ];

    // User sends multiple messages consecutively
    patientNotes
      .openEncounterNotesTab()
      .clickNewThreadButton()
      .typeThreadTitle(threadTitle)
      .clickCreateThreadButton()
      .addNewChatMessages(messages)
      .verifyMessagesInChat(messages)
      .verifyMessagesOrder(messages)
      .verifyMessageCount(messages.length);
  });
});

describe("Thread Creation", () => {
  beforeEach(() => {
    cy.viewport(viewPort.desktop1080p.width, viewPort.desktop1080p.height);
    cy.loginByApi("doctor");
    cy.visit("/");
    facilityCreation.selectFirstRandomFacility();
    patientEncounter
      .navigateToEncounters()
      .clickInProgressEncounterFilter()
      .openFirstEncounterDetails();
  });

  it("should create multiple threads and verify all appear without duplication", () => {
    const thread1Title = `Thread 1 - ${generatePhoneNumber()}`;
    const thread2Title = `Thread 2 - ${generatePhoneNumber()}`;
    const thread3Title = `Thread 3 - ${generatePhoneNumber()}`;

    // Create Thread 1
    patientNotes
      .openEncounterNotesTab()
      .clickNewThreadButton()
      .typeThreadTitle(thread1Title)
      .clickCreateThreadButton()
      .addNewChatMessages(["Thread 1 message"])
      .verifyThreadExists(thread1Title);

    // Create Thread 2
    patientNotes
      .clickNewThreadButton()
      .typeThreadTitle(thread2Title)
      .clickCreateThreadButton()
      .addNewChatMessages(["Thread 2 message"])
      .verifyThreadExists(thread2Title);

    // Create Thread 3
    patientNotes
      .clickNewThreadButton()
      .typeThreadTitle(thread3Title)
      .clickCreateThreadButton()
      .addNewChatMessages(["Thread 3 message"])
      .verifyThreadExists(thread3Title);

    // Verify all three threads exist
    patientNotes
      .verifyThreadExists(thread1Title)
      .verifyThreadExists(thread2Title)
      .verifyThreadExists(thread3Title)
      .verifyThreadCount(3);
  });
});

describe("Thread Visibility & Switching", () => {
  beforeEach(() => {
    cy.viewport(viewPort.desktop1080p.width, viewPort.desktop1080p.height);
    cy.loginByApi("doctor");
    cy.visit("/");
    facilityCreation.selectFirstRandomFacility();
    patientEncounter
      .navigateToEncounters()
      .clickInProgressEncounterFilter()
      .openFirstEncounterDetails();
  });

  it("should show only thread-specific messages when switching between threads", () => {
    const thread1Title = `Thread 1 - ${generatePhoneNumber()}`;
    const thread2Title = `Thread 2 - ${generatePhoneNumber()}`;
    const thread3Title = `Thread 3 - ${generatePhoneNumber()}`;
    const thread1Messages = ["Thread 1 message 1", "Thread 1 message 2"];
    const thread2Messages = ["Thread 2 message 1", "Thread 2 message 2"];
    const thread3Messages = ["Thread 3 message 1", "Thread 3 message 2"];

    // Create Thread 1 with messages
    patientNotes
      .openEncounterNotesTab()
      .clickNewThreadButton()
      .typeThreadTitle(thread1Title)
      .clickCreateThreadButton()
      .addNewChatMessages(thread1Messages)
      .verifyMessagesInChat(thread1Messages);

    // Create Thread 2 with messages
    patientNotes
      .clickNewThreadButton()
      .typeThreadTitle(thread2Title)
      .clickCreateThreadButton()
      .addNewChatMessages(thread2Messages)
      .verifyMessagesInChat(thread2Messages)
      .verifyMessagesNotExistInChat(thread1Messages);

    // Create Thread 3 with messages
    patientNotes
      .clickNewThreadButton()
      .typeThreadTitle(thread3Title)
      .clickCreateThreadButton()
      .addNewChatMessages(thread3Messages)
      .verifyMessagesInChat(thread3Messages)
      .verifyMessagesNotExistInChat(thread1Messages)
      .verifyMessagesNotExistInChat(thread2Messages);

    // Switch to Thread 1 and verify only Thread 1 messages appear
    patientNotes
      .changeThread(thread1Title)
      .verifyMessagesInChat(thread1Messages)
      .verifyMessagesNotExistInChat(thread2Messages)
      .verifyMessagesNotExistInChat(thread3Messages);

    // Switch to Thread 2 and verify only Thread 2 messages appear
    patientNotes
      .changeThread(thread2Title)
      .verifyMessagesInChat(thread2Messages)
      .verifyMessagesNotExistInChat(thread1Messages)
      .verifyMessagesNotExistInChat(thread3Messages);

    // Switch to Thread 3 and verify only Thread 3 messages appear
    patientNotes
      .changeThread(thread3Title)
      .verifyMessagesInChat(thread3Messages)
      .verifyMessagesNotExistInChat(thread1Messages)
      .verifyMessagesNotExistInChat(thread2Messages);
  });

  it("should maintain message isolation when sending messages in different threads", () => {
    const thread1Title = `Isolation Thread 1 - ${generatePhoneNumber()}`;
    const thread2Title = `Isolation Thread 2 - ${generatePhoneNumber()}`;
    const initialThread1Message = "Initial message in Thread 1";
    const additionalThread1Message = "Additional message in Thread 1";
    const thread2Message = "Message in Thread 2";

    // Create Thread 1 with initial message
    patientNotes
      .openEncounterNotesTab()
      .clickNewThreadButton()
      .typeThreadTitle(thread1Title)
      .clickCreateThreadButton()
      .addNewChatMessages([initialThread1Message]);

    // Create Thread 2 with message
    patientNotes
      .clickNewThreadButton()
      .typeThreadTitle(thread2Title)
      .clickCreateThreadButton()
      .addNewChatMessages([thread2Message])
      .verifyMessagesInChat([thread2Message])
      .verifyMessagesNotExistInChat([initialThread1Message]);

    // Switch back to Thread 1 and add another message
    patientNotes
      .changeThread(thread1Title)
      .addNewChatMessages([additionalThread1Message])
      .verifyMessagesInChat([initialThread1Message, additionalThread1Message])
      .verifyMessagesNotExistInChat([thread2Message]);

    // Switch to Thread 2 and verify messages are isolated
    patientNotes
      .changeThread(thread2Title)
      .verifyMessagesInChat([thread2Message])
      .verifyMessagesNotExistInChat([
        initialThread1Message,
        additionalThread1Message,
      ]);
  });
});
