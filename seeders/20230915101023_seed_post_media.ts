import { Knex } from 'knex'

/* eslint max-len: 0 */
export async function seed (knex: Knex): Promise<void> {
  // Inserts seed entries
  await knex('post_media').insert([
    { id: '1ecb0481-5f09-442d-b6cb-656baf28e665', post_id: '1d57216d-1a91-4ee7-b4a5-ac56cf89d010', type: 'Embed', title: 'Embeddable player', thumbnail_url: null },
    { id: 'b980bdd7-c16c-4230-87cc-c8ff05aecac5', post_id: '1d57216d-1a91-4ee7-b4a5-ac56cf89d010', type: 'Video', title: 'Video player', thumbnail_url: 'https://images.pexels.com/photos/963060/pexels-photo-963060.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=' },
    { id: 'd531e29d-f893-40ef-96ee-7137682dc55c', post_id: 'bd57216d-1a91-4ee7-b4a5-ac56cf89d011', type: 'Video', title: 'Video player', thumbnail_url: 'https://images.pexels.com/photos/963060/pexels-photo-963060.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=' },
    { id: '3bcf3c92-3b3b-4026-b190-070f383fa38c', post_id: 'cd57216d-1a91-4ee7-b4a5-ac56cf89d012', type: 'Embed', title: 'Embeddable player', thumbnail_url: null },
    { id: '102269ed-9160-5e92-1005-b2f88ca508ab', post_id: 'cd57216d-1a91-4ee7-b4a5-ac56cf89d012', type: 'Video', title: 'Video player', thumbnail_url: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg' },
    { id: 'd75d6c11-2486-4a04-b6ab-9db8b4c0ce72', post_id: 'dd57216d-1a91-4ee7-b4a5-ac56cf89d013', type: 'Embed', title: 'Embeddable player', thumbnail_url: null },
    { id: 'd347e256-68b7-4a80-bb10-39c05fbc018d', post_id: 'ed57216d-1a91-4ee7-b4a5-ac56cf89d014', type: 'Video', title: 'Video player', thumbnail_url: 'https://images.pexels.com/photos/963060/pexels-photo-963060.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=' },
    { id: '3dcf7d01-adb6-4146-9eee-9bcf28ba67d1', post_id: 'fd57216d-1a91-4ee7-b4a5-ac56cf89d015', type: 'Embed', title: 'Embeddable player', thumbnail_url: null },
    { id: '7f38380c-d33f-4c83-ac92-f3ee8bc7d9db', post_id: 'd57216d1-1a91-4ee7-b4a5-ac56cf89d016', type: 'Embed', title: 'Embeddable player', thumbnail_url: null },
    { id: '69839c28-88e8-4087-ba16-a4e7978882ee', post_id: 'ad57216d-1a91-4ee7-b4a5-ac56cf89d017', type: 'Video', title: 'Video player', thumbnail_url: 'https://images.pexels.com/photos/3836087/pexels-photo-3836087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: '328ee319-16e4-43c9-9e0b-1fe6091ee8ec', post_id: '3d57216d-1a91-4ee7-b4a5-ac56cf89d018', type: 'Embed', title: 'Embeddable player', thumbnail_url: null },
    { id: '7685a6ca-6abf-11ee-b962-0242ac120002', post_id: '3d57216d-1a91-4ee7-b4a5-ac56cf89d018', type: 'Video', title: 'Video player', thumbnail_url: null },
    { id: 'e324fd49-af4a-4b57-8a4b-e7bcf99ef874', post_id: '2d57216d-1a91-4ee7-b4a5-ac56cf89d019', type: 'Embed', title: 'Embeddable player', thumbnail_url: null },
    { id: 'a3211c76-fef0-4973-9f09-775d927c8ec9', post_id: '4d57216d-1a91-4ee7-b4a5-ac56cf89d020', type: 'Embed', title: 'Embeddable player', thumbnail_url: null },
    { id: '9b480b9c-5757-4110-87f1-0eeadd9ad314', post_id: '5d57216d-1a91-4ee7-b4a5-ac56cf89d021', type: 'Embed', title: 'Embeddable player', thumbnail_url: null },
    { id: 'e24c0bb2-00bb-4521-b10b-957a26b84d0d', post_id: '6d57216d-1a91-4ee7-b4a5-ac56cf89d022', type: 'Video', title: 'Video player', thumbnail_url: 'https://images.pexels.com/photos/3836087/pexels-photo-3836087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: '0e6ca820-c8bc-475a-bd70-6223a82507c1', post_id: '7d57216d-1a91-4ee7-b4a5-ac56cf89d023', type: 'Video', title: 'Video player', thumbnail_url: 'https://images.pexels.com/photos/33044/sunflower-sun-summer-yellow.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: 'b333b986-9a83-45af-8dc9-b36d1904bdf1', post_id: '8d57216d-1a91-4ee7-b4a5-ac56cf89d024', type: 'Embed', title: 'Embeddable player', thumbnail_url: null },
    { id: '07a787b7-1b56-4e77-8da8-510c42368a42', post_id: '9d57216d-1a91-4ee7-b4a5-ac56cf89d025', type: 'Embed', title: 'Embeddable player', thumbnail_url: null },
    { id: '07f8d19f-c95f-401c-a169-196b07ad72f9', post_id: 'fa57216d-1a91-4ee7-b4a5-ac56cf89d026', type: 'Video', title: 'Video player', thumbnail_url: 'https://images.pexels.com/photos/33044/sunflower-sun-summer-yellow.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: '7d3531b2-b2e0-4ce2-9fba-0b65e420f589', post_id: 'fb57216d-1a91-4ee7-b4a5-ac56cf89d027', type: 'Video', title: 'Video player', thumbnail_url: 'https://images.pexels.com/photos/13513966/pexels-photo-13513966.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: '8261dce3-c229-4dfb-96ce-fdb44582a3dd', post_id: 'fc57216d-1a91-4ee7-b4a5-ac56cf89d028', type: 'Embed', title: 'Embeddable player', thumbnail_url: null },
    { id: '883b3dc7-12eb-4dc1-ac3a-65414fed2275', post_id: 'fd57216d-1a91-4ee7-b4a5-ac56cf89d029', type: 'Video', title: 'Video player', thumbnail_url: 'https://images.pexels.com/photos/313768/pexels-photo-313768.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: 'd840b588-5aec-46d1-bcb5-9f2c8e8d5e9d', post_id: 'fe57216d-1a91-4ee7-b4a5-ac56cf89d030', type: 'Video', title: 'Video player', thumbnail_url: 'https://images.pexels.com/photos/313768/pexels-photo-313768.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: '6370691d-72ef-43df-9cca-58c6dd4641cc', post_id: 'ff57216d-1a91-4ee7-b4a5-ac56cf89d031', type: 'Video', title: 'Video player', thumbnail_url: 'https://images.pexels.com/photos/17272138/pexels-photo-17272138/free-photo-of-escaleras-agua-rocas-orilla.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: 'a808a7dc-4dd1-4d20-9316-0f9b5d89cf42', post_id: 'fda7216d-1a91-4ee7-b4a5-ac56cf89d032', type: 'Embed', title: 'Embeddable player', thumbnail_url: null },
    { id: '688df573-68f6-42f8-9317-740eaf4c2003', post_id: 'fdb7216d-1a91-4ee7-b4a5-ac56cf89d033', type: 'Embed', title: 'Embeddable player', thumbnail_url: null },
    { id: '66f66386-142b-44c3-b294-9eb751b8a230', post_id: 'fdc7216d-1a91-4ee7-b4a5-ac56cf89d034', type: 'Video', title: 'Video player', thumbnail_url: null },
    { id: '34b2000b-15c3-44b0-9389-90dde6efecce', post_id: 'fdd7216d-1a91-4ee7-b4a5-ac56cf89d035', type: 'Video', title: 'Video player', thumbnail_url: 'https://images.pexels.com/photos/4183499/pexels-photo-4183499.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: '6fee3e3d-d074-4751-bb3a-5f0b136e6ded', post_id: 'fde7216d-1a91-4ee7-b4a5-ac56cf89d036', type: 'Video', title: 'Video player', thumbnail_url: 'https://images.pexels.com/photos/16453277/pexels-photo-16453277/free-photo-of-pajaro-bosque-fauna-ornitologia.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: '08321dcc-9f66-4ab8-9403-49df9f5ed927', post_id: 'fdf7216d-1a91-4ee7-b4a5-ac56cf89d037', type: 'Embed', title: 'Embeddable player', thumbnail_url: 'https://images.pexels.com/photos/15524483/pexels-photo-15524483/free-photo-of-pajaro-rama-fauna-petirrojo.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    // This post media does not have any media url to check the behavior when a post media does not have any media url
    { id: '06cae4ae-991c-4d85-9066-ca7fafdef199', post_id: 'fd07216d-1a91-4ee7-b4a5-ac56cf89d038', type: 'Video', title: 'Video player', thumbnail_url: 'https://images.pexels.com/photos/15524483/pexels-photo-15524483/free-photo-of-pajaro-rama-fauna-petirrojo.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    // This line will be commented to check the behavior when a post does not have any post media
    // { id: '98bbec9d-9fdc-4d2e-a50a-4907f1fc6111', post_id: 'fd17216d-1a91-4ee7-b4a5-ac56cf89d039' },
  ])
}
