import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { withSvgKnownIssueNote } from './preview';

type DecoratorArgs = Parameters<typeof withSvgKnownIssueNote>;
type StoryArg = DecoratorArgs[0];
type ContextArg = DecoratorArgs[1];

function renderDecorator(svgKnownIssue: boolean | undefined) {
  const Story = (() => <Text>story content</Text>) as StoryArg;
  const context = { parameters: { svgKnownIssue } } as unknown as ContextArg;
  return render(withSvgKnownIssueNote(Story, context));
}

describe('withSvgKnownIssueNote', () => {
  it('always renders the story content', () => {
    const { getByText } = renderDecorator(true);
    expect(getByText('story content')).toBeTruthy();
  });

  it('shows the warning banner when svgKnownIssue is true', () => {
    const { getByText } = renderDecorator(true);
    expect(getByText(/react-native-svg/)).toBeTruthy();
  });

  it('hides the warning banner when svgKnownIssue is not set', () => {
    const { queryByText } = renderDecorator(undefined);
    expect(queryByText(/react-native-svg/)).toBeNull();
  });
});
