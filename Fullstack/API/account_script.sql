create table Account (
	id serial,
	username varchar(200),
	password varchar(200),
	last_update timestamp,
	constraint pk_account primary key (id)
);

insert into Account (username, password, last_update)
values ('testuser', 'e16b2ab8d12314bf4efbd6203906ea6c', now()); --p@ssw0rd