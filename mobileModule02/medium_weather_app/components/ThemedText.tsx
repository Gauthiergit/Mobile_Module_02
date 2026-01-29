import { Colors} from '@/constants/theme';
import { StyleSheet, Text, useColorScheme, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  color?: string;
  type?: 'default' | 'title'; 
};

export function ThemedText({
  style,
  color,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const colorScheme = useColorScheme();
  const textColor = Colors[colorScheme ?? 'light'].text

  return (
    <Text
      style={[
        {color: color ?? textColor},
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  }
});
