create database test;

use test;

create table user (
	uid varchar(20),
	password varchar(20),
	email varchar(50),
	primary key(uid)
);

create table form ( 
	fid int(11) unsigned auto_increment, 
	uid varchar(20), 
	title varchar(50), 
	info json, 
	state int(2), 
	add_date datetime, 
	begin_date datetime, 
	end_date datetime, 
	primary key(fid),
	foreign key (uid) references user(uid) on delete cascade on update cascade
);



create table answer ( 
	aid int(12) unsigned auto_increment, 
	fid int(11) unsigned, 
	uid varchar(20), 
	date datetime, 
	ip json, 
	content json, 
	primary key(aid), 
	foreign key(fid) references form(fid) on delete cascade on update cascade, 
	foreign key(uid) references user(uid) on delete cascade on update cascade
);

