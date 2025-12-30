jQuery(document).ready(function(){

	let chart;
	let current_type = "weekly";

	function create_chart(type){
		const $canvas = jQuery('.gosmtp-pro-report-chart-canvas');
		if ($canvas.length === 0) return;

		const ctx = jQuery('.gosmtp-pro-report-chart-canvas')[0].getContext("2d");
		const total_success = gosmtp_charts_data[type].successful.reduce((a, b) => a + b, 0);
		const total_failed = gosmtp_charts_data[type].failed.reduce((a, b) => a + b, 0);
		const total_sent = total_success + total_failed;
		const percent_success = total_sent ? Math.round((total_success / total_sent) * 100) : 0;
		const percent_failed  = total_sent ? Math.round((total_failed  / total_sent) * 100) : 0;

		jQuery('#gosmtp-pro-total-sent').text(total_sent);
		jQuery('#gosmtp-pro-total-success').text(total_success);
		jQuery('#gosmtp-pro-total-failed').text(total_failed);
		jQuery('#gosmtp-pro-report-success-percent').text('Success Rate: ('+ percent_success + '%)');
		jQuery('#gosmtp-pro-report-failed-percent').text('Failure Rate: ('+ percent_failed + '%)');

		const chart_height = 500;

		const green_gradient = ctx.createLinearGradient(0, 0, 0, chart_height);
		green_gradient.addColorStop(0, 'rgba(0, 128, 0, 0.3)');
		green_gradient.addColorStop(1, 'rgba(0, 128, 0, 0)');

		const red_gradient = ctx.createLinearGradient(0, 0, 0, chart_height);
		red_gradient.addColorStop(0, 'rgba(255, 0, 0, 0.3)');
		red_gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');

		const data = {
			labels: gosmtp_charts_data[type].labels,
			datasets: [
				{
					label: 'Successful',
					data: gosmtp_charts_data[type].successful,
					borderColor: 'green',
					backgroundColor: green_gradient,
					tension: 0.3,
					fill: {
						target: 'origin',
						above: green_gradient
					},
					pointRadius: 4,
					pointHoverRadius: 6,
					pointHitRadius: 10
				},
				{
					label: 'Failed',
					data: gosmtp_charts_data[type].failed,
					borderColor: 'red',
					backgroundColor: red_gradient,
					tension: 0.3,
					fill: {
						target: 'origin',
						above: red_gradient
					},
				}
			]
		};

		const config = {
			type: 'line',
			data: data,
			options: {
				responsive: true,
				interaction: {
					mode: 'index',
					intersect: false
				},
				plugins: {
					legend: {
						position: 'top',
						labels: {
							font: {
								size: 14
							}
						}
					},
					title: {
						display: true,
						text: type.charAt(0).toUpperCase() + type.slice(1) + ' Report',
						font: {
							size: 18
						}
					},
					tooltip: {
						callbacks: {
							label: function(context){
								const datasetLabel = context.dataset.label || '';
								const value = context.parsed.y !== undefined ? context.parsed.y : context.raw;
								return datasetLabel + ':' + value;
							}
						}
					}
				},
				scales: {
					y: {
						ticks: {
							stepSize: 1
						}
					}
				}
			},
		};

		if(chart) chart.destroy();
		chart = new Chart(ctx, config);
	}

	create_chart(current_type);

	// Tab click handler
	jQuery('.gosmtp-pro-report-chart-tab').on('click', function(){
		const type = jQuery(this).data('type');
		if(type !== current_type){
			current_type = type;
			create_chart(type);
		}

		jQuery('.gosmtp-pro-report-chart-tab').removeClass('active');
		jQuery(this).addClass('active');
	});
});