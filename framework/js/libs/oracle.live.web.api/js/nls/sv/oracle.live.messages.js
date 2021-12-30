/*
 * Copyright (c) 2018 Oracle. All rights reserved.
 *
 * This material is the confidential property of Oracle Corporation or its
 * licensors and may be used, reproduced, stored or transmitted only in
 * accordance with a valid Oracle license or sublicense agreement.
 */

/**
 * Oracle Live Experience web component messages - Swedish language example (language-code: sv)
 * Messages defined in 'root' language file can be overridden by language-specific definitions such as in this file,
 * anything not defined in the language-specific file will use the 'root' definition.
 */

define({
  // Button Labels for dialog
  button_continue: "Fortsätt",
  button_cancel: "Avbryt",
  button_ok: "OK",
  button_allow: "Ja",
  button_deny: "Nej",
  button_submit: "Skicka",
  button_start: "Starta",
  button_share: "Skicka",
  label_connecting: "Kopplar...",
  label_reconnecting: "Försöker återuppkoppla samtalet...",
  label_video_preview: "Förhandsvisning av video",

  // Titles on message-less alerts when the call has ended.
  dialog_title_start_call: "Samtalet kan spelas in",
  dialog_message_start_call: "Vill du fortsätta?",
  dialog_title_service_ended: "Samtalet avslutat",
  dialog_message_service_ended: "Tack för att du använde vår tjänst idag!",
  notification_failed_to_establish_call: "Tjänsten är inte tillgänglig just nu, försök igen senare.",
  serviceUnavailable: "Tjänst ej tillgänglig",
  //call quality rating
  dialog_message_service_quality_rating: "Hur var den tekniska kvaliteten?",
  label_service_quality_good: "OK",
  label_service_quality_bad: "Dålig",
  label_service_quality_excellent: "Utmärkt",
  // Title on message less alert, confirming that the user wants to disconnect
  dialog_title_end_call: "Avsluta samtalet",
  dialog_message_end_call: "Är du säker på att du vill avsluta samtalet?",
  label_duration: "Samtalslängd",
  /*
   label_duration: "Duration",
   notification_local_reconnecting: "You have been disconnected. Attempting to reconnect...",
   notification_local_reconnected: "You have been reconnected.",
   notification_reconnect_failed: "Sorry we are having trouble reconnecting. Please try again later.",
   notification_remote_reconnecting: "The associate has been disconnected. Waiting for them to reconnect...",
   notification_remote_reconnected: "The associate has reconnected.",
   remoteReconnectionFailureMessage: "Sorry we are having trouble reconnecting. Please try again later.",
   camRequestTitle: "Allow us to see your surroundings",
   camRestartTitle: "Allow us to see your camera again",
   camRequestMessage: "You can stop the video and mute the audio at any time by clicking the pause button.",
   camRestartMessage: "",
   camDismissedTitle: "Your video has been turned off",
   dialog_title_request_for_video_upgrade: "Accept incoming video?",
   dialog_message_request_for_video_upgrade: "We will use your devices camera to better assess your needs. " + 
   "You can stop the video and mute the audio at any time by tapping on 'Hold'.",
   notification_local_video_stopped: "Thank you! We've finished using your camera.",
   */

  // These messages are shown when the agent requests the end user to share their
  // screen, or when the end user just tries to share their screen.
  // Title and message on an alert.
  // Message 2 is used if the end user's video is running at the same time. If so we
  // turn off video.
  dialog_title_start_screenshare: "Vill du dela din skärm?",
  screenSharingDespiteCameraMessage: "Videodelning pausas medan du delar skärmen, " +
          "och återupptas automatiskt när skärmdelningen avslutas.",
  dialog_message_start_screenshare: "Du kan sluta dela skärmen genom att trycka på " +
          "\"Skärmen delas\".",
  /*
   notification_screenshare_active: "Screen sharing is active,Tap to stop.",
   dialog_title_stop_screenshare: "Stop Sharing Screen",
   dialog_message_stop_screenshare: "Do you want to stop sharing your screen with the associate?",
   notification_screenshare_stopped: "Screen sharing has been stopped.",
   dialog_title_remote_add_screenshare: "The other party would like to share their screen",
   dialog_message_remote_add_screenshare: "You can minimize or close the shared screen at any time",
   notification_remote_screenshare_stopped: "The other party has stopped sharing their screen",
   remoteScreenShareEndedMessage: "",
   dialog_title_no_camera_permission: "Camera Access Off",
   dialog_message_no_camera_permission: "Turn on Camera in Settings to start a video call",
   dialog_title_no_mic_permission: "Microphone Access Off",
   dialog_message_no_mic_permission: "Turn on Microphone in Settings to start a call",
   dialog_title_no_camera_for_screenshare_permission: "Screen sharing requires camera access",
   welcomePopUpMessage: "Hey, I am here to help if you need it!",
   connectingYouPopUpMessage: "We are connecting you with our next available associate...",
   welcomeShortCode: "Tap to share your screen with the representative",
   connectingShortCode: "When prompted, provide the following code to the representative:",
   */

  notification_local_hold: "Samtalet är pausat",
  notification_remote_hold: "Samtalet är pausat",
  notification_remote_annotation_started: "Den andra sidan har börjat rita på webbsidan",
  notification_remote_annotation_stopped: "Den andra sidan har slutat rita på webbsidan",

  /*
   callIsPausedHint: "The call is paused",
   callInProgressHint_audio: "Call in progress",
   callInProgressHint_video: "Video call in progress",
   callInProgressHint_screenshare: "Screenshare in progress",
   headphonePluggedInTitle: "Headset enabled",
   headphonePluggedInMessage: "Please use the headphones to continue conversation.",
   headphoneUnpluggedTitle: "Using internal speaker",
   notification_headset_unplugged: "You've unplugged the headphones. " +
   "Please use the earpiece to continue your conversation, or tap the speaker button to use the loudspeaker.",
   loudSpeakerOnTitle: "Using loudspeaker",
   notification_earpiece_to_speaker: "Please use the loud speaker to continue conversation. " + 
   "Use the speaker button for earpiece.",
   loudSpeakerOffTitle: "Using internal speaker",
   notification_speaker_to_earpiece: "Please use the earpiece to continue conversation. " +
   "Use the speaker button for loud speakers",
   dialog_message_no_answer: "No answer",
   dialog_message_no_agent_available: "No associate is available at this moment.",
   dialog_title_limited_connectivity: "Limited Connectivity",
   dialog_message_limited_connectivity: "  Your network connection might not be fast " + 
   "enough for the service. Do you want to continue?",
   notification_network_connectivity_issue: "You are experiencing network issues. Please check the connectivity.",
   notification_network_connectivity_restored: "Your network connectivity is back to normal.",
   label_support_unavailable: "Live support unavailable. Check your network connection.",
   loadingVideoPreview: "Loading video preview...",
   loadingVideo: "Loading video...",
   dialog_title_system_message: "System Message",
   notification_failed_to_connect: "Network unavailable. Please check your data connection and try again",
   notification_resource_limit_reached: "Sorry, but we're really busy at the moment. Please try again later.",
   dialog_title_meeting_invalid_url: "Meeting",
   dialog_message_meeting_invalid_url: "Invalid meeting URL",
   dialog_message_request_for_recording: "Please note, this session may be recorded",
   notification_remote_annotation_started: "Associate is annotating on your screen at the moment",
   notification_remote_annotation_stopped: "Associate has stopped annotating on your screen",
   label_position_in_queue: "Position in Queue",
   */

  label_record: "Rec",
  exitTooltip: "Avsluta samtalet",
  pauseTooltip: "Pausa samtalet",
  pauseDisabledTooltip: "Pausa samtalet (inaktiverad)",
  resumeTooltip: "Återuppta samtalet",
  startCameraTooltip: "Visa kamera",
  stopCameraTooltip: "Sluta visa kamera",
  cameraDisabledTooltip: "Visa kamera (inaktiverad)",
  shareScreenTooltip: "Visa skärm",
  stopScreenShareTooltip: "Sluta visa skärm",
  screenShareDisabledTooltip: "Visa skärm (inaktiverad)",
  minimizeTooltip: "Minimera videon",
  maximizeTooltip: "Maximera videon",
  hideVideoTooltip: "Göm all video",
  hideLocalVideoTooltip: "Göm denna video",
  zoomDefaultText: "100%",
  serviceFailedTitle: "Samtalet misslyckades",
  serviceEndedErrorMessage: "Samtalet avbröts på grund av ett fel.",
  diagnosticsFailedMessage: "Vi kunde inte starta din mikrofon eller kamera. " +
          "Kontrollera att de är tillgängliga för sidan.",
  pictureDescription: "Bild av {0}",
  poorConnectionTitle: "Långsam internet-uppkoppling",
  poorNetworkConnectingMessage: "Långsam internet-uppkoppling",
  poorNetworkConnectedMessage: "Kontrollera att du är uppkopplad.",
  shareScreenTitle: "Tillåt oss att se din skärm",
  shareScreenMessage: "Du kan avsluta skärmdelningen när du vill.",
  diagnosticsPopupMessage: "Kontrollerar att mikrofon och kamera är tillgängliga..."
});
