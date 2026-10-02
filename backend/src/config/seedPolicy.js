export const shouldAutoSeed = ({ mongoUri, eventCount }) =>
  !mongoUri?.trim() && eventCount === 0;
