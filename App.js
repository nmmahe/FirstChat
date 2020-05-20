/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {useState} from 'react';
import firebase from 'firebase';
import 'firebase/firestore';
import {
  API_KEY,
  AUTH_DOMAIN,
  DATABASE_URL,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
  MEASUREMENT_ID,
} from 'react-native-dotenv';

const config = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
};
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {messages: []};
    this.onSend = this.onSend.bind(this);
  }
  readUserData() {
    console.log('here');

    firebase
      .firestore()
      .collection('Messages')
      .orderBy('createdAt', 'desc')
      .get()
      .then(snapshot => {
        const data = snapshot.docs.map(doc => {
          return doc.data();
        });
        console.log(data);
        this.setState({messages: data});
      });
  }
  writeUserData(message) {
    //Parse the date so it works between app and firebase storage
    const createdAt = Date.parse(message[0].createdAt);
    return firebase
      .firestore()
      .collection('Messages')
      .add({...message[0], createdAt});
  }
  componentDidMount() {
    this.readUserData();
  }

  onSend(messages = []) {
    this.setState(previousState => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
    this.writeUserData(messages);
  }
  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        user={{
          _id: 1,
        }}
      />
    );
  }
}
const styles = StyleSheet.create({});

export default App;

//Couldn't quite get this to work with functional components. Maybe revisit
// const App = () => {
//   const [messages, setMessages] = useState(
//     [
//       {
//         _id: 1,
//         text: 'Hello developer',
//         createdAt: new Date(),
//         user: {
//           _id: 2,
//           name: 'React Native',
//           avatar: 'https://placeimg.com/140/140/any',
//         },
//       },
//     ],
//     messages,
//   );
//   //Change onsend to functional
//   const onSend = messageList => {
//     setMessages(GiftedChat.append(messages, messageList));
//   };
//   return (
//     <>
//       {console.log(messages)}
//       <StatusBar barStyle="dark-content" />
//       <SafeAreaView>
//         <ScrollView
//           contentInsetAdjustmentBehavior="automatic"
//           style={styles.scrollView}>
//           <View>
//             <GiftedChat
//               messages={messages}
//               onSend={messageList =>
//                 setMessages(GiftedChat.append(messages, messageList))
//               }
//               user={{
//                 _id: 1,
//               }}
//             />
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </>
//   );
// };
