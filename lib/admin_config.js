AdminConfig = {
	collections: {
		Logs: {
			icon: 'pencil',
			tableColumns: [
			{label: 'Message', name: 'message'},
			{label: 'Timestamp', name: 'createdAt'},
			{label: 'User', name: 'createdBy'}
			]
		},
		Tickets: {
			icon: 'file',
		},
		Handles: {
			icon: 'car',
			tableColumns: [
			{label: 'Callsign', name: 'callsign'},
			{label: 'Name', name: 'name'},
			{label: 'Last log', name: 'lastLog'}
			]
		}
	}
};