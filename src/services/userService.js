import API_BASE_URL from "./api";

export async function getUsers() {

    const token = localStorage.getItem("access_token");

    const response = await fetch(
        `${API_BASE_URL}/api/users`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
}

export async function createUser(userData) {

    const token = localStorage.getItem("access_token");

    const response = await fetch(
        `${API_BASE_URL}/api/users`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify(userData)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
}
export async function updateUser(id, userData) {

    const token = localStorage.getItem("access_token");

    const response = await fetch(

        `${API_BASE_URL}/api/users/${id}`,

        {

            method: "PUT",

            headers: {

                "Content-Type": "application/json",

                Authorization: `Bearer ${token}`

            },

            body: JSON.stringify(userData)

        }

    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(data.message);

    }

    return data;

}