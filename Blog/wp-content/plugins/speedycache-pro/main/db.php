<?php
/*
* SPEEDYCACHE
* https://speedycache.com/
* (c) SpeedyCache Team
*/

namespace SpeedyCache;

if( !defined('SPEEDYCACHE_PRO_VERSION') ){
	die('HACKING ATTEMPT!');
}

class DB{

	static function clean($type){
		if(self::optimize_db($type)){
			wp_send_json(array('success' => true));
		}
	}

	static function optimize_db($type){
		global $wpdb;

		if($type === 'transient_options'){
			$wpdb->query("DELETE FROM `$wpdb->options` WHERE option_name LIKE '%\_transient\_%' ;");
			return true;
		}
		
		if($type === 'expired_transient'){
			$wpdb->query("DELETE FROM `$wpdb->options` WHERE option_name LIKE '_transient_timeout%' AND option_value < " . time());
			return true;
		}
		
		if($type === 'trackback_pingback'){
			$wpdb->query("DELETE FROM `$wpdb->comments` WHERE comment_type = 'trackback' OR comment_type = 'pingback' ;");
			return true;
		}
		
		if($type === 'trashed_spam_comments'){
			$wpdb->query("DELETE FROM `$wpdb->comments` WHERE comment_approved = 'spam' OR comment_approved = 'trash' ;");
			return true;
		}
		
		if($type === 'trashed_contents'){
			$wpdb->query("DELETE FROM `$wpdb->posts` WHERE post_status = 'trash';");
			return true;
		}
		
		if($type === 'post_revisions'){
			$wpdb->query("DELETE FROM `$wpdb->posts` WHERE post_type = 'revision';");
			return true;
		}
		
		if($type === 'all_warnings'){
			$wpdb->query("DELETE FROM `$wpdb->posts` WHERE post_type = 'revision';");
			$wpdb->query("DELETE FROM `$wpdb->posts` WHERE post_status = 'trash';");
			$wpdb->query("DELETE FROM `$wpdb->comments` WHERE comment_approved = 'spam' OR comment_approved = 'trash' ;");
			$wpdb->query("DELETE FROM `$wpdb->comments` WHERE comment_type = 'trackback' OR comment_type = 'pingback' ;");
			$wpdb->query("DELETE FROM `$wpdb->options` WHERE option_name LIKE '%\_transient\_%' ;");
			$wpdb->query("DELETE FROM `$wpdb->options` WHERE option_name LIKE '_transient_timeout%' AND option_value < " . time());
			return true;
		}
	}

	// DB cache cleanup for cron
	static function db_auto_optm_handler(){
		global $speedycache;

		$delete_map = [
			'db_post_revisions' => 'post_revisions',
			'db_trashed_contents' => 'trashed_contents',
			'db_trashed_spam_comments' => 'trashed_spam_comments',
			'db_trackbacks_pingback' => 'trackback_pingback',
			'db_transient_options' => 'transient_options',
			'db_expired_transient' => 'expired_transient'
		];

		foreach($delete_map as $option_key => $clean_type){
			if(!empty($speedycache->options[$option_key])){
				self::optimize_db($clean_type);
			}
		}

		// Log
		if(class_exists('\SpeedyCache\Logs')){
			\SpeedyCache\Logs::log('delete');
			\SpeedyCache\Logs::action();
		}
	}

}
