import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchUserPosts } from '@/constants/api';
import { useRouter } from 'expo-router';

const MyPosts = () => {
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch user posts for a specific page
  const fetchPage = async (page) => {
    setLoading(true);
    try {
      const { posts, totalPages } = await fetchUserPosts(page, 10); // Fetch 10 posts per page
      setPosts(posts);
      setTotalPages(totalPages);
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to load posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(1); // Load the first page on mount
  }, []);

 
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <Text>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF7F2' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={{ flex: 1, paddingHorizontal: 10 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginVertical: 10,
              textAlign: 'center',
            }}
          >
            My Posts
          </Text>
          <View style={{ marginTop: 10 }}>
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <View key={index} style={{ width: '100%', marginBottom: 10 }}>
                  <TouchableOpacity
  onPress={() =>
    router.push({
      pathname: `/(app)/(profilemenu)/(editpost)/${post.post_uid}`,
      params: { postData: JSON.stringify(post) },
    })
  }
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 10,
                      backgroundColor: 'white',
                      borderRadius: 4,
                    }}
                  >
                    {/* Post Content */}
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 16,
                          maxWidth: '70%',
                          marginBottom: 10,
                        }}
                      >
                        {post.animal_name || post.animal_type}
                      </Text>
                      <Text style={{ fontWeight: 'bold', fontSize: 14 }}>
                        {new Date(post.date).toLocaleDateString()}
                      </Text>
                    </View>
                    {/* Post Image */}
                    {post.image_url ? (
                      <Image
                        source={{ uri: post.image_url }}
                        style={{
                          width: '100%',
                          height: 200,
                          borderRadius: 10,
                          marginBottom: 10,
                        }}
                        resizeMode="contain"
                      />
                    ) : (
                      <Text>No image available.</Text>
                    )}
                    {/* Post Status */}
                    <View
                      style={{
                        backgroundColor:
                          post.status === 'found' ? '#FF9F1C' : '#9c5a9c',
                        borderRadius: 4,
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        alignSelf: 'flex-end',
                      }}
                    >
                      <Text style={{ color: 'white' }}>
                        {post.status === 'found' ? 'Found' : 'Lost'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={{ textAlign: 'center', marginVertical: 20 }}>
                No posts found.
              </Text>
            )}
          </View>
        </View>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 20,
              alignItems: 'center',
            }}
          >
            {/* First Page Button */}
            {currentPage > 1 && (
              <TouchableOpacity
                onPress={() => fetchPage(1)}
                style={{
                  marginHorizontal: 5,
                  width: 20,
                  height: 20,
                  borderRadius: 5,
                  backgroundColor: '#3D3D49',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: 'white', fontSize: 10 }}>{'<<'}</Text>
              </TouchableOpacity>
            )}
            {/* Page Numbers */}
            {getPageNumbers().map((pageNumber) => (
              <TouchableOpacity
                key={pageNumber}
                onPress={() => fetchPage(pageNumber)}
                style={{
                  marginHorizontal: 5,
                  width: 25,
                  height: 25,
                  borderRadius: 5,
                  backgroundColor: '#3D3D49',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: pageNumber === currentPage ? '#FF9F1C' : 'white',
                    fontSize: 15,
                    fontWeight: pageNumber === currentPage ? 'bold' : 'normal',
                  }}
                >
                  {pageNumber}
                </Text>
              </TouchableOpacity>
            ))}
            {/* Last Page Button */}
            {currentPage < totalPages && (
              <TouchableOpacity
                onPress={() => fetchPage(totalPages)}
                style={{
                  marginHorizontal: 5,
                  width: 20,
                  height: 20,
                  borderRadius: 5,
                  backgroundColor: '#3D3D49',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: 'white', fontSize: 10 }}>{'>>'}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyPosts;
