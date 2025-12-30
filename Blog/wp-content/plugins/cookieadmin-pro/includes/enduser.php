<?php

namespace CookieAdminPro;

if(!defined('COOKIEADMIN_PRO_VERSION') || !defined('ABSPATH')){
	die('Hacking Attempt');
}

class Enduser{
	
	static $http_cookies;
	
	static function enqueue_scripts(){
		
		global $cookieadmin_settings;
		
		wp_enqueue_script('cookieadmin_pro_js', COOKIEADMIN_PRO_PLUGIN_URL . 'assets/js/consent.js', [], COOKIEADMIN_PRO_VERSION, 'async');
	
		$vars['ajax_url'] = admin_url('admin-ajax.php');
		$vars['nonce'] = wp_create_nonce('cookieadmin_pro_js_nonce');
		$vars['home_url'] = home_url();
		$vars['reconsent'] = (!empty($cookieadmin_settings['hide_reconsent']) ? 0 : 1);
		// cookieadmin_r_print($policy);die();
		
		wp_localize_script('cookieadmin_pro_js', 'cookieadmin_pro_vars', $vars);
		
		$view = get_option('cookieadmin_law', 'cookieadmin_gdpr');	
		$policy = cookieadmin_load_policy();
		
		if(!empty($policy) && !empty($view)){
		
			$cookieadmin_on_color = $policy[$view]['cookieadmin_slider_on_bg_color'];
			$cookieadmin_off_color = $policy[$view]['cookieadmin_slider_off_bg_color'];
			$cookieadmin_links_color = $policy[$view]['cookieadmin_links_color'];

			$custom_css = '';
			
			if(!empty($cookieadmin_links_color)){
				$custom_css .= '.cookieadmin_remark, .cookieadmin_showmore { color: ' . esc_attr($cookieadmin_links_color) . ' !important; }';
			}
			
			if(!empty($cookieadmin_on_color)){
				$custom_css .= 'input:checked+.cookieadmin_slider, input:disabled+.cookieadmin_slider { background-color: '.esc_attr($cookieadmin_on_color).' !important; }';
			}
			
			if(!empty($cookieadmin_off_color)){
				$custom_css .= '.cookieadmin_slider{ background-color: '.esc_attr($cookieadmin_off_color).' !important; }';
			}
			
			if(!empty($custom_css)){
				wp_add_inline_style( 'cookieadmin-style', $custom_css );
			}
		}
	}
	
	// TODO
	static function cookieadmin_check_rate_limit($ip) {
		global $wpdb;

		//First Fetch stored rate limit for this IP
		$table_name = esc_sql($wpdb->prefix . 'cookie_consent_logs');
		
		$rate_limit_count = $wpdb->get_var($wpdb->prepare(
			"SELECT rate_limit_count FROM $table_name WHERE user_ip = %s",
			$ip
		));

		if (!$rate_limit_count) {
			return true; // No rate limit set, allow request
		}

		$time_window = 10; // Time window in seconds as  of now we are checking for 10 seconds, we can pass this value as function's paramater as well.

		$transient_key = 'rate_limit_' . md5($ip);
		$requests = get_transient($transient_key);

		if (!$requests) {
			$requests = [];
		}

		$current_time = time();

		$requests = array_filter($requests, function($timestamp) use ($current_time, $time_window) {
			return ($current_time - $timestamp) < $time_window;
		});

		if (count($requests) >= $rate_limit_count) {
			return false; //Too many requests
		}

		$requests[] = $current_time;
		set_transient($transient_key, $requests, $time_window);

		return true; //Request allowed
	}
	
	// TODO
	static function get_location_details($ip){
		
		global $cookieadmin;
		
		$return = array();
		
		$api_url = cookieadmin_pro_api_url(-1, 'softwp');
		$url = $api_url.'ipinfo.php?ip='.rawurlencode($ip).'&license='.$cookieadmin['license']['license'].'&url='.rawurlencode(site_url());
		
		$response = wp_remote_get($url);
		
		if(is_wp_error($response)){
			return $return;
		}
		
		$body = wp_remote_retrieve_body($response);
		$data = json_decode($body, true);
		
		if(empty($data)){
			return $return;
		}
		
		return $data;
	}
	
	static function consent_exists($consent_id){
		global $wpdb;
		
		$table_name = esc_sql($wpdb->prefix . 'cookieadmin_consents');
		$result = $wpdb->get_var(
			$wpdb->prepare("SELECT id FROM $table_name WHERE consent_id = %s", $consent_id)
		);
		return !empty($result);
	}

	static function anonymize_ip($ip) {
		
		if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
			// Replace last octet with 0
			return preg_replace('/\.\d+$/', '.0', $ip);
		} elseif (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6)) {
			// Replace last segment with ::
			return preg_replace('/:[0-9a-fA-F]+$/', '::', $ip);
		}
		
		return $ip; // fallback if invalid IP
	}

	static function generate_consent_id() {
		
		return sprintf(
			'%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
			wp_rand(0, 0xffff), wp_rand(0, 0xffff),
			wp_rand(0, 0xffff),
			wp_rand(0, 0x0fff) | 0x4000, // version 4
			wp_rand(0, 0x3fff) | 0x8000, // variant
			wp_rand(0, 0xffff), wp_rand(0, 0xffff), wp_rand(0, 0xffff)
		);
	}
	
	static function save_consent(){
		global $wpdb;
		
		if(empty($_POST['cookieadmin_preference'])){
			exit(1);
		}
		
		$default_prefrencs = array('accept', 'reject', 'functional', 'analytics', 'marketing');
		$prefrnc = json_decode(sanitize_text_field(wp_unslash($_POST['cookieadmin_preference'])));
		foreach($prefrnc as $k => $preff){
			if(!in_array($preff, $default_prefrencs)){
				array_splice($prefrnc, $k, 1);
			}
		}
		$prefrnc = json_encode($prefrnc, true);
		
		$user_ip = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';
		$location = \CookieAdminPro\Enduser::get_location_details($user_ip);
		
		$masked_user_ip = \CookieAdminPro\Enduser::anonymize_ip($user_ip);
		
		$country = !empty($location['country']) ? sanitize_text_field($location['country']) : '';
		$browser = isset($_SERVER['HTTP_USER_AGENT']) ? sanitize_text_field(wp_unslash($_SERVER['HTTP_USER_AGENT'])) : '';
		$domain = wp_parse_url(home_url())['host'];
		$table_name = esc_sql($wpdb->prefix . 'cookieadmin_consents');
		
		$consent_id = !empty($_POST['cookieadmin_consent_id']) ? sanitize_text_field(wp_unslash($_POST['cookieadmin_consent_id'])) : '';
		
		$data = array(   
				'user_ip'        => inet_pton($masked_user_ip),
				'consent_time'   => time(),
				'country'        => $country,
				'browser'        => $browser,
				'domain'         => $domain,
				'consent_status' => $prefrnc
			);
		
		//Save consent in DB
		if(!empty($consent_id) && \CookieAdminPro\Enduser::consent_exists($consent_id)){
			
			$format = array('%s', '%d', '%s', '%s', '%s', '%s');
			
			$where = array('consent_id' => $consent_id);
			$where_format = array('%s');
			
			$inserted = $wpdb->update($table_name, $data, $where, $format, $where_format);
			
		}else{
			
			$consent_id = \CookieAdminPro\Enduser::generate_consent_id();
			$data['consent_id'] = $consent_id;
			
			$format = array('%s', '%d', '%s', '%s', '%s', '%s', '%s');

			$inserted = $wpdb->insert($table_name, $data, $format);
		}
		
		if (false === $inserted) {
			wp_send_json_error(array('response' => 'Error saving consent data.'));
		} else {
			wp_send_json_success(array('response' => $consent_id));
		}
	}

	static function wp_head() {
		
		$policy = cookieadmin_load_policy();
		
		$law = get_option('cookieadmin_law', 'cookieadmin_gdpr');
		
		$cookieadmin_default_allowed = (!empty($policy[$law]['preload']) ? $policy[$law]['preload'] : []);
		$cookieadmin_default_categories = ['functional', 'analytics', 'marketing', 'accept', 'reject'];
		
		$cookieadmin_js_preferences = [];
		foreach ($cookieadmin_default_categories as $category) {
			$cookieadmin_js_preferences[$category] = (!empty($cookieadmin_default_allowed) && in_array($category, $cookieadmin_default_allowed) ? true : false);
		}
		
		$cookieadmin_js_preferences_json = json_encode($cookieadmin_js_preferences);
		$inline_js = "
		
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		
		function cookieadmin_update_gcm(update) {
		
			let cookieadmin_preferences = $cookieadmin_js_preferences_json;
				
			const cookieAdminMatch = document.cookie.match(/(?:^|; )cookieadmin_consent=([^;]*)/);
			
			if (cookieAdminMatch) {
				try {
					const cookieadmin_parsed = JSON.parse(decodeURIComponent(cookieAdminMatch[1]));
					cookieadmin_preferences.functional = cookieadmin_parsed.functional === 'true';
					cookieadmin_preferences.analytics = cookieadmin_parsed.analytics === 'true';
					cookieadmin_preferences.marketing = cookieadmin_parsed.marketing === 'true';
					cookieadmin_preferences.accept = cookieadmin_parsed.accept === 'true';
					cookieadmin_preferences.reject = cookieadmin_parsed.reject === 'true';
				} catch (err) {
					
				}
			}
			
			if (typeof gtag === 'function') {
			
				let cookieadmin_gtag_mode = update === 1 ? 'update' : 'default';
				
				try {
					
					gtag('consent', cookieadmin_gtag_mode, {
						'ad_storage': cookieadmin_preferences.marketing || cookieadmin_preferences.accept ? 'granted' : 'denied',
						'analytics_storage': cookieadmin_preferences.analytics || cookieadmin_preferences.accept  ? 'granted' : 'denied',
						'ad_user_data': cookieadmin_preferences.marketing || cookieadmin_preferences.accept ? 'granted' : 'denied',
						'ad_personalization': cookieadmin_preferences.marketing || cookieadmin_preferences.accept ? 'granted' : 'denied',
						'personalization_storage': cookieadmin_preferences.marketing || cookieadmin_preferences.accept ? 'granted' : 'denied',
						'security_storage': 'granted',
						'functionality_storage': cookieadmin_preferences.functional || cookieadmin_preferences.accept ? 'granted' : 'denied'
					});
					
				} catch (e) {
					
				}
			}
		}
		
		cookieadmin_update_gcm(0);
		";

		wp_register_script('cookieadmin-gcm', '', [], null, false);

		wp_add_inline_script('cookieadmin-gcm', $inline_js);

		wp_enqueue_script('cookieadmin-gcm');
		
	}
	
	static function powered_by($html){
		
		global $cookieadmin_settings;
		
		if(!empty($cookieadmin_settings['hide_powered_by'])){
			return '';
		}
		
		return $html;
	}

}

