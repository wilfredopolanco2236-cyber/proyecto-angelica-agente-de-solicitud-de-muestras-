export type Confidence = 'high' | 'medium' | 'low';

export type ConversationState =
  | 'NO_ACTIVE_FLOW'
  | 'AWAITING_CLIENT'
  | 'AWAITING_PRODUCT'
  | 'AWAITING_QUANTITY'
  | 'AWAITING_UNIT'
  | 'DRAFT_READY_FOR_REVIEW'
  | 'PENDING_MANAGEMENT'
  | 'MANUAL_REVIEW_REQUIRED'
  | 'APPROVED_OR_DISTRIBUTED';

export type Intent =
  | 'START_SAMPLE_REQUEST'
  | 'SET_CLIENT'
  | 'ADD_ITEM'
  | 'PROVIDE_QUANTITY'
  | 'SHOW_DRAFT'
  | 'FINISH_DRAFT'
  | 'CHECK_STATUS'
  | 'REMOVE_ITEM'
  | 'UPDATE_ITEM'
  | 'MANAGE_ALLOWLIST'
  | 'GREET'
  | 'HELP'
  | 'UNKNOWN';

export interface UserContext {
  phone: string;
  roles: string[];
  permissions: string[];
  name?: string;
}
