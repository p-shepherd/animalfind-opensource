import axios from 'axios';
import { Alert } from 'react-native';
import { getRouterRef } from '@/utils/routerRefError'; 
import { getIdToken } from '@/utils/auth';


const api = axios.create({
  baseURL: 'https://animalfind.shepherdpaul.com/api',
});

// Global Axios error handler
api.interceptors.response.use(
  (response) => response, 
  (error) => {
    const router = getRouterRef(); 
    const status = error.response?.status;

    if (!error.response) {
      
      Alert.alert('Error', 'No internet connection', [
        {
          text: 'OK',
          onPress: () => {
            router?.replace('/(auth)/index');
          },
        },
      ]);
    } else if (status === 413) {
      // Handle 413 Payload Too Large
      Alert.alert(
        'Error',
        'The file you tried to add to the post was too big. Please select a smaller file - max size 9 MB.'
      );
    } else if (status >= 500) {
      // Handle 500-range errors
      Alert.alert('Error', 'Server error. Please try again later.', [
        {
          text: 'OK',
          onPress: () => {
            router?.replace('/(auth)/index');
          },
        },
      ]);
    } else if ([400, 401, 403, 404, 405, 429].includes(status)) {
      // Handle 400s
      Alert.alert(
        'Error',
        `There was an error ${status}: click OK to logout.`,
        [
          {
            text: 'OK',
            onPress: () => {
              router?.replace(`/(app)/error/${status}?errorcode=${status}`); 
            },
          },
        ]
      );
    } else {
      // Catch-all for unexpected errors
      Alert.alert(
        'Error',
        `An unexpected error occurred (${status}). Please contact support and describe what happened.`,
        [
          {
            text: 'OK',
            onPress: () => {
              router?.replace(`/(app)/error/${status}?errorcode=${status}`); // Redirect to error page
            },
          },
        ]
      );
    }

    return Promise.reject(error); // return the error for further handling
  }
);



export const reportPost = async (postUid, reason) => {
  try {
    const idToken = await getIdToken(); 

    const response = await api.post(
      '/report',
      { postUid, reason },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data; 
  } catch (error) {
    console.error('Error reporting post:', error);
    throw error; // Re-throw the error for global error handling
  }
};


export const triggerTest400Error = async () => {
  try {
    const response = await api.get('/test404');
    return response.data;
  } catch (error) {
    console.error('Error from /test400:', error);
    throw error; 
  }
};


export const verifyRecaptchaToken = async (token) => {
  try {
    const response = await api.post(
      '/verify-recaptcha',
      { token },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response.data.success;
  } catch (error) {
    console.error('Error verifying reCAPTCHA token:', error);
    throw error;
  }
};


export const sendTokenToBackend = async () => {
  try {
    const idToken = await getIdToken();

    const response = await api.post('/register', {}, {
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error sending token to backend:', error);
    throw error;
  }
};


export const registerOrUpdateGoogleUser = async () => {
  try {
    const idToken = await getIdToken();

    const response = await api.post('/register', {}, {
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('User registered/updated in backend:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error registering/updating Google user:', error);
    throw error;
  }
};


export const postTokenToBackend = async (postData) => {
  try {
    const formData = new FormData();
    for (const key in postData) {
      if (key !== 'picture') {
        formData.append(key, postData[key]);
      }
    }
    if (postData.picture) {
      formData.append('picture', {
        uri: postData.picture.uri,
        name: postData.picture.name || `${postData.postUid}.jpg`,
        type: postData.picture.mimeType || 'image/jpeg',
      });
    }

    const idToken = await getIdToken();

    const response = await api.post('/posting', formData, {
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error while trying to post:', error);
    throw error;
  }
};


export const fetchUserPosts = async (page = 1, pageSize = 10) => {
  try {
    const idToken = await getIdToken();

    const response = await api.get(`/myposts?page=${page}&pageSize=${pageSize}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
    });

    return {
      posts: response.data.posts || [], 
      totalPages: response.data.totalPages || 1, 
    };
  } catch (error) {
    console.error('Error fetching user posts:', error);
    throw error;
  }
};

export const deletePost = async (postUid) => {
  try {
    const idToken = await getIdToken();

    const response = await api.delete(`/deletePost/${postUid}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};



export const searchAnimals = async (searchParams) => {
  try {
    const idToken = await getIdToken();

    const response = await api.post('/search', searchParams, {
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
    });

    return {
      posts: response.data.posts,
      totalPages: response.data.totalPages,
    };
  } catch (error) {
    console.error('Error fetching search results:', error);
    throw error;
  }
};


export const updatePost = async (postData) => {
  try {
    const formData = new FormData();
    for (const key in postData) {
      if (key !== 'picture') {
        formData.append(key, postData[key]);
      }
    }
    if (postData.picture) {
      formData.append('picture', {
        uri: postData.picture.uri,
        name: postData.picture.name || `${postData.postUid}.jpg`,
        type: postData.picture.mimeType || 'image/jpeg',
      });
    }

    const idToken = await getIdToken();

    const response = await api.put('/editpost', formData, {
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error while updating post:', error);
    throw error;
  }
};

export default api;
