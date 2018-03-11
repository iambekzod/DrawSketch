import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {linkTo} from '@storybook/addon-links';

import {Button, Welcome} from '@storybook/react/demo';
import {SideBar} from './containers/SideBar'
import {observableTodoStore} from './stores/gameStore'
import {TodoList} from './containers/Canvas'

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')}/>);

storiesOf('Button', module).add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>
).add('with some emoji', () => <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
).add('sidebar', () => <SideBar store={observableTodoStore}></SideBar>
).add('game', () => <TodoList store={observableTodoStore}></TodoList>
);
