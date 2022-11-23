const SUPABASE_URL = 'https://vmhclpevfecxhpxwubhs.supabase.co';
const SUPABASE_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtaGNscGV2ZmVjeGhweHd1YmhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTI5Nzk4MzgsImV4cCI6MTk2ODU1NTgzOH0.pWvGlCrbKNRZWBKDRsPR8rGxu8nodj7nq8cY1rPNglI';
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* Auth related functions */

export function getUser() {
    return client.auth.user();
}

export async function signUpUser(email, password) {
    return await client.auth.signUp({
        email,
        password,
    });
}

export async function signInUser(email, password) {
    return await client.auth.signIn({
        email,
        password,
    });
}

export async function signOutUser() {
    return await client.auth.signOut();
}

/* Data functions */

export async function createListItem(item, rating) {
    const response = await client
        .from('favorites')
        .insert({ item, rating, user_id: client.auth.user().id }); // because of RLS and our default values, we add user_id for free

    return response.data;
}

export async function getListItems() {
    const response = await client
        .from('favorites')
        .select()
        .match({ user_id: client.auth.user().id });

    return response.data;
}

// i want to set cross_out:true for a particular item
// how do i refer to this particular item?
// i use its id. Ids are unique. There is no way to accidentally update the wrong thing if you supply this unique id to supabase

export async function editListItem(item) {
    // sets a given list item's property to true
    console.log('first', item.cross_out);
    const response = await client
        .from('favorites')
        .update({ cross_out: !item.cross_out })
        .match({ id: item.id });
    console.log('item.cross_out', item.cross_out);

    return response.data;
}

export async function deleteList() {
    const response = await client.from('favorites').delete().match({ user_id: getUser().id });

    return response.data;
}
