-- Create storage bucket for moment media files
insert into storage.buckets (id, name, public)
values ('moment-media', 'moment-media', true)
on conflict (id) do nothing;

-- Create storage policies for moment media
create policy "moment_media_select_own"
  on storage.objects for select
  using (bucket_id = 'moment-media' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "moment_media_insert_own"
  on storage.objects for insert
  with check (bucket_id = 'moment-media' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "moment_media_update_own"
  on storage.objects for update
  using (bucket_id = 'moment-media' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "moment_media_delete_own"
  on storage.objects for delete
  using (bucket_id = 'moment-media' and auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage bucket for profile photos
insert into storage.buckets (id, name, public)
values ('profile-photos', 'profile-photos', true)
on conflict (id) do nothing;

-- Create storage policies for profile photos
create policy "profile_photos_select_own"
  on storage.objects for select
  using (bucket_id = 'profile-photos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "profile_photos_insert_own"
  on storage.objects for insert
  with check (bucket_id = 'profile-photos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "profile_photos_update_own"
  on storage.objects for update
  using (bucket_id = 'profile-photos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "profile_photos_delete_own"
  on storage.objects for delete
  using (bucket_id = 'profile-photos' and auth.uid()::text = (storage.foldername(name))[1]);
