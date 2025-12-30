
function cookieadmin_pro_set_consent(prefrenc, days) {

	const data = 'action=cookieadmin_pro_ajax_handler&cookieadmin_act=save_consent' +
		'&cookieadmin_pro_security=' + encodeURIComponent(cookieadmin_pro_vars.nonce) +
		'&cookieadmin_preference=' + encodeURIComponent(JSON.stringify(Object.keys(prefrenc)));

	let payload = data;
	if (cookieadmin_is_obj(cookieadmin_is_consent) && !!cookieadmin_is_consent.consent) {
		payload += '&cookieadmin_consent_id=' + cookieadmin_is_consent.consent;
	}

	// Make async request — don’t block or wait
	const xhttp = new XMLHttpRequest();
	xhttp.open("POST", cookieadmin_pro_vars.ajax_url, true); // true = async

	xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

	xhttp.onload = function () {
		if (this.status === 200) {
			try {
				const parsed = JSON.parse(this.responseText);
				if (parsed.success && parsed.data && parsed.data.response) {
					cookieadmin_save_consent_cookie(prefrenc, days, parsed.data.response);
				}
			} catch (e) {
				console.error("Invalid JSON response:", e);
			}
		}
	};

	xhttp.onerror = function () {
		console.error("AJAX request failed");
	};

	xhttp.send(payload);

	// Immediately return
	return true;
}
