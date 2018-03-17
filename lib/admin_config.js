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
			tableColumns: [
			{label: 'Title', name: 'title'},
			{label: 'Owner', name: 'owner'},
			{label: 'Priority', name: 'priority'},
			{label: 'Status', name: 'status'}
			]
		},
		Handles: {
			icon: 'car',
			tableColumns: [
			{label: 'Callsign', name: 'callsign'},
			{label: 'Name', name: 'name'},
			{label: 'Last log', name: 'lastLog'}
			]
		}
	},
	userSchema: new SimpleSchema({
	  'username': {
	  	type: String
	  },
	  'profile.function': {
       type: String,
       allowedValues: ['WL', 'RVD']
     }
  })
};