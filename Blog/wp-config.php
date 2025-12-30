<?php
define('WP_CACHE', true); // Added by SpeedyCache

/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'kiliman3_wp624' );

/** Database username */
define( 'DB_USER', 'kiliman3_wp624' );

/** Database password */
define( 'DB_PASSWORD', '36pl2[6[SC' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'nkzin9e33hc4kihkf6xmzaxc1c7r2h5w4duixoym1dql6049rt8lmyavk9peicju' );
define( 'SECURE_AUTH_KEY',  '1f2jb6pkyifwrjdfusnl2wpvnglurisahtl298uqaiwobl9mj681r0bcuyt6au76' );
define( 'LOGGED_IN_KEY',    'ezxyxffpo1fto8luwckqsqygq96oec84kwqfweshrczpczufqfif9dbsronr2tin' );
define( 'NONCE_KEY',        '3nnwtcb2iz9hklqshlrkgdcneshrtcskw0w52iktagzlz6jecdg0tjyxwpbewdsu' );
define( 'AUTH_SALT',        'przed1igrue5sgsaop6bj1rzolrrasi7dgpd6koxmnyauth3poufgtjpnu6ortmb' );
define( 'SECURE_AUTH_SALT', 'xuwltinkmp2gm48lziwwvvrpnqn71x6fgxsqgh8s2gzbxxu5t1neh5oehk8g3zcd' );
define( 'LOGGED_IN_SALT',   'x6vlj1599nrl3hn3bt6nbq9dvdg1xt1fht42euwdf9sbv9bukjofa6cggyekhs4g' );
define( 'NONCE_SALT',       'sqctj5wnfyfbjxncfs3hhiuibcbdqnvh9cmmy10lj5y52htj2al2zxh72bc58ssv' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 *
 * At the installation time, database tables are created with the specified prefix.
 * Changing this value after WordPress is installed will make your site think
 * it has not been installed.
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/#table-prefix
 */
$table_prefix = 'wpuf_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */

// Force correct URLs when served from /Blog on this host
if ( ! defined( 'WP_HOME' ) ) {
	define( 'WP_HOME', 'https://' . $_SERVER['HTTP_HOST'] . '/Blog' );
}
if ( ! defined( 'WP_SITEURL' ) ) {
	define( 'WP_SITEURL', 'https://' . $_SERVER['HTTP_HOST'] . '/Blog' );
}

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
