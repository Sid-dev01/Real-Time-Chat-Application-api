CREATE TABLE "friend_requests" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"sender_id" varchar(26) NOT NULL,
	"receiver_id" varchar(26) NOT NULL,
	"user_low_id" varchar(26) NOT NULL,
	"user_high_id" varchar(26) NOT NULL,
	"friendship_status" smallint DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_user_low_id_users_id_fk" FOREIGN KEY ("user_low_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_user_high_id_users_id_fk" FOREIGN KEY ("user_high_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "friend_requests_active_relationship_unique_idx" ON "friend_requests" USING btree ("user_low_id","user_high_id") WHERE "friend_requests"."friendship_status" IN (1, 2);--> statement-breakpoint
CREATE INDEX "friend_requests_status_idx" ON "friend_requests" USING btree ("friendship_status");