import ora, { Ora } from 'ora';

let currentSpinner: Ora | null = null;

export const spinner = {
  start: (message: string): Ora => {
    if (currentSpinner) {
      currentSpinner.stop();
    }
    currentSpinner = ora(message).start();
    return currentSpinner;
  },

  succeed: (message?: string) => {
    if (currentSpinner) {
      currentSpinner.succeed(message);
      currentSpinner = null;
    }
  },

  fail: (message?: string) => {
    if (currentSpinner) {
      currentSpinner.fail(message);
      currentSpinner = null;
    }
  },

  warn: (message?: string) => {
    if (currentSpinner) {
      currentSpinner.warn(message);
      currentSpinner = null;
    }
  },

  info: (message?: string) => {
    if (currentSpinner) {
      currentSpinner.info(message);
      currentSpinner = null;
    }
  },

  stop: () => {
    if (currentSpinner) {
      currentSpinner.stop();
      currentSpinner = null;
    }
  },

  text: (message: string) => {
    if (currentSpinner) {
      currentSpinner.text = message;
    }
  },
};

export default spinner;
