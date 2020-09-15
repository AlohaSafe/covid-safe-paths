import { createAction } from '@reduxjs/toolkit';

const TOGGLE_SANDBOX_HEALTHCARE_AUTHORITY = 'TOGGLE_SANDBOX_HEALTHCARE_AUTHORITY';

const toggleSandboxHealthcareAuthorityAction = createAction(
  TOGGLE_SANDBOX_HEALTHCARE_AUTHORITY,
);

export default toggleSandboxHealthcareAuthorityAction;
