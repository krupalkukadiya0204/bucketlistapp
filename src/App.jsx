import { useState, useEffect } from "react";
import {
  Authenticator,
  Button,
  Text,
  TextField,
  Heading,
  Flex,
  View,
  Image,
  Grid,
  Divider,
} from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { getUrl } from "aws-amplify/storage";
import { uploadData } from "aws-amplify/storage";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";

// Amplify configuration
Amplify.configure(outputs);
const client = generateClient({ authMode: "userPool" });

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);  // Added loading state

  // Fetch items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  // Fetch bucket list items
  async function fetchItems() {
    setLoading(true); // Set loading state to true when fetching starts
    try {
      const { data: items } = await client.models.BucketItem.list();
      const itemsWithUrls = await Promise.all(
        items.map(async (item) => {
          if (item.image) {
            const linkToStorageFile = await getUrl({
              path: ({ identityId }) => `media/${identityId}/${item.image}`,
            });
            item.image = linkToStorageFile.url;
          }
          return item;
        })
      );
      setItems(itemsWithUrls);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);  // Set loading state to false when fetching completes
    }
  }

  // Create a new item
  async function createItem(event) {
    event.preventDefault();
    const form = new FormData(event.target);

    try {
      const { data: newItem } = await client.models.BucketItem.create({
        title: form.get("title"),
        description: form.get("description"),
        image: form.get("image").name,
      });

      // If the item has an image, upload the image file
      if (newItem.image) {
        await uploadData({
          path: ({ identityId }) => `media/${identityId}/${newItem.image}`,
          data: form.get("image"),
        });
      }

      // Refresh items after creating a new one
      fetchItems();
    } catch (error) {
      console.error("Error creating item:", error);
    } finally {
      event.target.reset();  // Reset the form fields after submission
    }
  }

  // Delete an item
  async function deleteItem({ id }) {
    try {
      await client.models.BucketItem.delete({ id });
      fetchItems(); // Refresh items after deletion
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }

  return (
    <Authenticator>
      {({ signOut }) => (
        <Flex className="App container mt-5" direction="column" alignItems="center">
          <Heading level={1} className="mb-4">My Bucket List</Heading>

          {/* Form to add new bucket list items */}
          <View as="form" className="w-75" onSubmit={createItem}>
            <div className="row justify-content-center">
              <div className="col-md-8">
                <TextField
                  className="form-control mb-3"
                  name="title"
                  placeholder="Bucket List Item"
                  label="Bucket List Item"
                  labelHidden
                  required
                />
              </div>
              <div className="col-md-8">
                <TextField
                  className="form-control mb-3"
                  name="description"
                  placeholder="Description"
                  label="Description"
                  labelHidden
                  required
                />
              </div>
              <div className="col-md-8">
                <View
                  name="image"
                  as="input"
                  className="form-control mb-3"
                  type="file"
                  accept="image/png, image/jpeg"
                />
              </div>
              <div className="col-md-8">
                <Button type="submit" className="btn btn-primary w-100">
                  Add to Bucket List
                </Button>
              </div>
            </div>
          </View>

          <Divider className="w-100 my-4" />

          {/* Displaying bucket list items */}
          <Heading level={2} className="mb-4">My Bucket List Items</Heading>
          {loading ? (  // Show a loading indicator while fetching
            <Text>Loading bucket list items...</Text>
          ) : (
            <Grid className="container">
              <div className="row">
                {items.map((item) => (
                  <div className="col-md-4 mb-4" key={item.id || item.title}>
                    <div className="card h-100">
                      <div className="card-body">
                        <Heading level={3} className="card-title">{item.title}</Heading>
                        <Text className="card-text">{item.description}</Text>
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={`Visual for ${item.title}`}
                            className="card-img-top"
                            style={{ width: '100%', height: 'auto' }}
                          />
                        )}
                      </div>
                      <div className="card-footer text-center">
                        <Button
                          className="btn btn-danger"
                          onClick={() => deleteItem(item)}
                        >
                          Delete Item
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Grid>
          )}

          <Button className="btn btn-outline-secondary mt-5" onClick={signOut}>
            Sign Out
          </Button>
        </Flex>
      )}
    </Authenticator>
  );
}
