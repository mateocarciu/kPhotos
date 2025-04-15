export interface Country {
  id: number
  short: string
  name: string
  enabled: boolean
}

export interface UserProfile {
  id: number
  user_id: number
  login: string
  email: string
  email_validate: string
  firstname: string
  lastname: string
  display_name: string
  date_last_change_password: number
  otp: boolean
  sms: boolean
  sms_phone: string
  yubikey: boolean
  infomaniak_application: boolean
  double_auth: boolean
  double_auth_method: string
  remaining_rescue_code: number
  security_assistant: number
  security_check: boolean
  open_renewal_warranty_invoice_group_id: number[]
  auth_devices: any[]
  validated_at: number | null
  last_login_at: number
  administration_last_login_at: number
  invalid_email: boolean
  avatar: string
  locale: string
  language_id: number
  timezone: string
  country: Country
  unsuccessful_connexion_limit: boolean
  unsuccessful_connexion_rate_limit: number
  unsuccessful_connexion_notification: boolean
  successful_connexion_notification: boolean
}

export interface InfomaniakApiResponse<T> {
  data: T
  success: boolean
  error?: string
}

export interface UserResponse {
  profile: UserProfile
}

export interface DriveFileCapabilities {
  can_use_favorite: boolean
  can_become_sharelink: boolean
  can_use_team: boolean
  can_show: boolean
  can_read: boolean
  can_write: boolean
  can_share: boolean
  can_leave: boolean
  can_delete: boolean
  can_rename: boolean
  can_move: boolean
  can_create_directory: boolean
  can_create_file: boolean
  can_upload: boolean
  can_move_into: boolean
  can_become_dropbox: boolean
  colorable: boolean
}

export interface DriveFileVersion {
  is_multiple: boolean
  number: number
  total_size: number
  keep_forever: boolean
}

export interface DriveFileConversionCapabilities {
  when_downloading: boolean
  download_extensions: string[]
  when_onlyoffice_opening: boolean
  onlyoffice_extension: string | null
}

export interface DriveFile {
  id: number
  name: string
  path: string
  type: 'dir' | 'file'
  status: string | null
  visibility: string
  drive_id: number
  depth: number
  created_by: number
  created_at: number | null
  added_at: number
  last_modified_at: number
  last_modified_by: number
  revised_at: number
  updated_at: number
  parent_id: number
  users: number[]
  teams: any[]
  is_favorite: boolean
  sharelink: any
  capabilities: DriveFileCapabilities
  categories: any[]
  color: string | null
  dropbox: any
  external_import: any
  size?: number
  mime_type?: string
  extension_type?: string
  scan_status?: string
  supported_by?: string[]
  version?: DriveFileVersion
  conversion_capabilities?: DriveFileConversionCapabilities
}

export interface DriveResponse {
  result: string
  data: DriveFile[]
  response_at: number
  cursor: string | null
  has_more: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface UserStoreState {
  profile: UserProfile | null
  isLoading: boolean
  error: string | null
}

export interface DriveStoreState {
  files: DriveFile[]
  isLoading: boolean
  error: string | null
}

export interface Drive {
  id: number
  name: string
  size: number
  used_size: number
  created_at: number
  updated_at: number
  in_maintenance: boolean
  maintenance_at: number | null
  maintenance_types: any[]
  version: string
  users_count: number
  users_quota: number
  product_id: number
  account_id: number
  expired_at: number
  is_locked: boolean
  description: string
  is_demo: boolean
  role: string
  account_admin: boolean
  is_in_app_subscription: boolean
}
