export interface WP_REST_API_Page_ACF {
	author_override: string;
	form_id?: number;
}

export interface WP_REST_API_Post_ACF {
	author_override: string;
	images: number[] | '';
}

export interface WP_REST_API_SHG_ACF {
	address_name: string;
	address: ACF_Address | false;
	email: string;
	instagram: string;
	facebook: string;
	phone: string;
	mobile: string;
	fax: string;
	homepage: string;
	region: string;
	audience: 'Erwachsene' | 'Kinder';
	meets_online: boolean;
	other_addresses: null;
	postal_name: string;
	postal_address: ACF_Address | null;
}

export interface WP_REST_API_Event_ACF {
	date_from: string;
	date_to: string;
	time_from: string;
	time_to: string;
	address_name: string;
	address: ACF_Address | false;
	is_main_event: boolean;
	needs_registration: boolean;
	form_id?: number;
}

export interface ACF_Address {
	address: string;
	lat: number;
	lng: number;
	street_number?: string;
	street_name?: string;
	street_name_short?: string;
	city: string;
	state: string;
	state_short: string;
	post_code: string;
	country: string;
	country_short: string;
}
