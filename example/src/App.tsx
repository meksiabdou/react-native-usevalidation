/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';

import {
  StyleSheet,
  View,
  Text,
  TextInputProps,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import useValidation, {
  ValidationInputType,
} from '@meksiabdou/react-native-usevalidation';

const InputView = ({
  name,
  label,
  error,
  value,
  type,
  handelOnChange,
  ...rest
}: TextInputProps & {
  handelOnChange: (e: any) => void;
  error?: string;
  name: string;
  type?: any;
  label: string;
}) => {
  return (
    <View style={[styles.inputView]}>
      <Text style={[styles.inputLabel]}>{label}</Text>
      <View style={[styles.inputGroupView]}>
        <TextInput
          {...rest}
          value={value}
          onChangeText={(text) => handelOnChange({ value: text, type, name })}
          style={styles.input}
        />
      </View>
      {error ? <Text style={[styles.inputError]}>{error}</Text> : null}
    </View>
  );
};

export default function App() {
  const inputs: Array<
    ValidationInputType & { props: TextInputProps & { label: string } }
  > = [
    {
      name: 'fullname',
      required: true,
      messages: {
        required: 'the fullname is required',
      },
      props: {
        label: 'Full name',
        placeholder: 'Meksi Abdennour',
        autoCorrect: false,
      },
    },
    {
      name: 'phone',
      required: true,
      regExp: /^[0]{1}[1-9]{1}[0-9]{8}$/g,
      messages: {
        required: 'the phone is required',
        regExp: 'the phone is invalid',
      },
      props: {
        label: 'Phone number',
        placeholder: '0550565822',
        keyboardType: 'phone-pad',
      },
    },
    {
      name: 'email',
      required: true,
      messages: {
        required: 'the email is required',
        regExp: 'the email is invalid',
      },
      props: {
        label: 'Email',
        placeholder: 'contact@example.com',
        autoCapitalize: 'none',
        keyboardType: 'email-address',
      },
    },
    {
      name: 'age',
      required: false,
      min: 20,
      max: 60,
      messages: {},
      props: {
        label: 'Age',
        placeholder: '20',
        autoCapitalize: 'none',
        keyboardType: 'number-pad',
      },
    },
    {
      name: 'password',
      required: true,
      maxLength: 12,
      minLength: 8,
      messages: {
        required: 'the password is required',
      },
      props: {
        label: 'Password',
        placeholder: '***********',
        secureTextEntry: true,
        autoCapitalize: 'none',
      },
    },
    {
      name: 'confirm-password',
      required: true,
      match: 'password',
      messages: {
        required: 'the confirm password is required',
        match: 'Be sure to match the password',
      },
      props: {
        label: 'Confirm password',
        placeholder: '***********',
        secureTextEntry: true,
        autoCapitalize: 'none',
      },
    },
  ];

  const { data, errors, handelOnChange, handelOnSubmit } =
    useValidation(inputs);

  const onSubmit = (status: boolean) => {
    if (status) {
      console.log(data);
    } else {
      console.log(errors);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text>Form Example</Text>
        <View style={{ marginTop: 20 }}>
          {inputs.map((item) => {
            return (
              <InputView
                key={item.name}
                name={item.name}
                {...item.props}
                type={item?.type}
                error={errors[item.name]}
                value={data[item.name]}
                handelOnChange={handelOnChange}
              />
            );
          })}
        </View>
        <View>
          <TouchableOpacity
            style={styles.btnSubmit}
            activeOpacity={0.8}
            onPress={() => handelOnSubmit(onSubmit)}
          >
            <Text style={{ color: '#fff', fontSize: 16 }}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
    //alignItems: 'center',
    //justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  inputView: {
    marginBottom: 10,
  },
  inputGroupView: {
    display: 'flex',
    alignContent: 'space-between',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: 5,
  },
  input: {
    minHeight: 45,
  },
  inputError: {
    marginTop: 10,
    color: '#ff0000',
    //textTransform: 'capitalize',
  },
  inputLabel: {
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  btnSubmit: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 3,
  },
});
