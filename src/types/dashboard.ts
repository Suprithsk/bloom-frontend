export interface SubscriptionPlan {
  plan_id: number;
  plan_name: string;
  end_date: string;
  try_on: number;
  model_credit_left: number;
}

export interface DashboardResponse {
  status: string;
  message: string;
  total_customer: number;
  total_model_created: number;
  try_on_models: number;
  demo_videolink: string;
  subscription_plan: SubscriptionPlan;
}

// New interfaces for models
export interface TextureMap {
  thumbnailUrl: string;
  metallicMapPathUrl: string | null;
  roughnessMapPathUrl: string | null;
  normalMapPathUrl: string | null;
  aoMapPathUrl: string | null;
  emissiveMapPathUrl: string | null;
  albedoMapPathUrl: string | null;
  heightMapPathUrl: string | null;
}

export interface Model {
  model_id: number;
  user_id: number;
  model_title: string;
  category: string;
  description: string;
  status: string;
  new_images_list: TextureMap[];
  tripo_status: string | null;
  all_texture_files: string[];
  obj_file: string;
  mtl_file: string;
  texture_file: string | null;
  albedo_map_path_texture_file: string | null;
  roughness_map_path_texture_file: string | null;
  normal_map_path_texture_file: string | null;
  emissive_map_path_texture_file: string | null;
  remaining_modeltime: string;
  created_at: string;
  images: string[];
}

export interface ModelsResponse {
  status: string;
  data: Model[];
}

// New interfaces for leads
export interface Lead {
  lead_id: number;
  name: string;
  models: string; // JSON string containing model data
  category: string[];
  total_price: number;
  phone_number: string;
  email: string;
  preview_Image: string;
  created_at: string;
  status: string;
}

export interface LeadsResponse {
  status: string;
  message: string;
  result: Lead[];
}

// Helper interface for parsed model data from leads
export interface LeadModel extends Model {
  price: string;
  quantity: number;
}

// New interface for retailer/user profile
export interface UserProfile {
  user: string;
  brand_name: string;
  email: string;
  profile_pic: string;
  phone_number: string;
  address: string;
  city: string;
  zip_code: string;
}

export interface UserProfileResponse {
  status: string;
  message: string;
  result: UserProfile;
}
export interface EditModel{
  model_title: string;
  category_id: number;
  description: string;
}