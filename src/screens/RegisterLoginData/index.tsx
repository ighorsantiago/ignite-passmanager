import React from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';

import { useForm } from 'react-hook-form';

import { RFValue } from 'react-native-responsive-fontsize';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

import { Input } from '../../components/Form/Input';
import { Button } from '../../components/Form/Button';

import {
  Container,
  HeaderTitle,
  Form
} from './styles';

interface FormData {
  title: string;
  email: string;
  password: string;
}

const schema = Yup.object().shape({
  title: Yup.string().required('Título é obrigatório!'),
  email: Yup.string().email('Email não é válido').required('Email é obrigatório!'),
  password: Yup.string().required('Senha é obrigatória!'),
});

export function RegisterLoginData() {

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  async function handleRegister(formData: FormData) {

    const newLoginData = {
      id: String(uuid.v4()),
      ...formData
    };

    // Save data on AsyncStorage
    try {

      const dataKey = '@passmanager:logins';

      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];

      const dataFormatted = [
        ...currentData,
        newLoginData
      ];

      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));
      reset();

    } catch (error) {
      Alert.alert("Erro");
    }
  }

  return (

    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <HeaderTitle>Salve o login de algum serviço!</HeaderTitle>

          <Form>
            <Input
              title="Título"
              name="title"
              control={control}
              placeholder="Escreva o título aqui"
              autoCapitalize="sentences"
              autoCorrect
              error={ errors.title && errors.title.message }
            />
            <Input
              title="Email"
              name="email"
              control={control}
              placeholder="Escreva o Email aqui"
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="email-address"
              error={ errors.email && errors.email.message }
            />
            <Input
              title="Senha"
              name="password"
              control={control}
              secureTextEntry
              placeholder="Escreva a senha aqui"
              error={ errors.password && errors.password.message }
            />

            <Button
              style={{
                marginTop: RFValue(26)
              }}
              title="Salvar"
              onPress={handleSubmit(handleRegister)}
            />
          </Form>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}