package example


# By default, deny requests.
default allow = false

# Allow admins to do anything.
allow {
	user_is_ioet_member
}

# user_is_admin is true if...
user_is_ioet_member {
	# "admin" is among the user's roles as per data.user_roles
	 input.domain == "ioet.com"
}
