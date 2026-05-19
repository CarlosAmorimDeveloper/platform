/**
 * @jest-environment jsdom
 */
'use strict';

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../src/components/Button/Button';

// react-native is resolved to __mocks__/react-native.js via moduleNameMapper

describe('Button — renderização', () => {
  it('renderiza children como texto', () => {
    render(<Button>Salvar</Button>);
    expect(screen.getByText('Salvar')).toBeTruthy();
  });

  it('renderiza com role=button para acessibilidade', () => {
    render(<Button>OK</Button>);
    expect(screen.getByRole('button')).toBeTruthy();
  });

  it('expõe testID no elemento raiz', () => {
    render(<Button testID="btn-save">Salvar</Button>);
    expect(screen.getByTestId('btn-save')).toBeTruthy();
  });
});

describe('Button — classes do container (variantes)', () => {
  it('primary aplica bg-primary-500', () => {
    render(<Button variant="primary">X</Button>);
    const el = screen.getByRole('button');
    expect(el.getAttribute('data-classname')).toContain('bg-primary-500');
  });

  it('secondary aplica bg-transparent e border', () => {
    render(<Button variant="secondary">X</Button>);
    const el = screen.getByRole('button');
    const cls = el.getAttribute('data-classname')!;
    expect(cls).toContain('bg-transparent');
    expect(cls).toContain('border-primary-500');
  });

  it('ghost aplica bg-transparent sem borda', () => {
    render(<Button variant="ghost">X</Button>);
    const el = screen.getByRole('button');
    const cls = el.getAttribute('data-classname')!;
    expect(cls).toContain('bg-transparent');
    expect(cls).not.toContain('border-');
  });

  it('danger aplica bg-transparent sem borda', () => {
    render(<Button variant="danger">X</Button>);
    const el = screen.getByRole('button');
    const cls = el.getAttribute('data-classname')!;
    expect(cls).toContain('bg-transparent');
    expect(cls).not.toContain('border-');
  });
});

describe('Button — classes do container (tamanhos)', () => {
  it('md aplica px-4 py-2', () => {
    render(<Button size="md">X</Button>);
    const cls = screen.getByRole('button').getAttribute('data-classname')!;
    expect(cls).toContain('px-4');
    expect(cls).toContain('py-2');
  });

  it('sm aplica px-3 py-1', () => {
    render(<Button size="sm">X</Button>);
    const cls = screen.getByRole('button').getAttribute('data-classname')!;
    expect(cls).toContain('px-3');
    expect(cls).toContain('py-1');
  });
});

describe('Button — estado disabled', () => {
  it('adiciona opacity-50 quando disabled', () => {
    render(<Button disabled>X</Button>);
    const cls = screen.getByRole('button').getAttribute('data-classname')!;
    expect(cls).toContain('opacity-50');
  });

  it('não adiciona opacity-50 quando não disabled', () => {
    render(<Button>X</Button>);
    const cls = screen.getByRole('button').getAttribute('data-classname')!;
    expect(cls).not.toContain('opacity-50');
  });

  it('aria-disabled=true quando disabled', () => {
    render(<Button disabled>X</Button>);
    expect(screen.getByRole('button').getAttribute('aria-disabled')).toBe('true');
  });
});

describe('Button — className extra', () => {
  it('inclui className extra no container', () => {
    render(<Button className="w-full">X</Button>);
    const cls = screen.getByRole('button').getAttribute('data-classname')!;
    expect(cls).toContain('w-full');
  });
});

describe('Button — interação onPress', () => {
  it('chama onPress ao clicar', () => {
    const onPress = jest.fn();
    render(<Button onPress={onPress}>Clique</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('não chama onPress quando disabled', () => {
    const onPress = jest.fn();
    render(<Button onPress={onPress} disabled>Clique</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });
});

describe('Button — classes do texto', () => {
  it('primary aplica text-neutral-0 no Text', () => {
    render(<Button variant="primary">X</Button>);
    const span = screen.getByText('X');
    expect(span.getAttribute('data-classname')).toContain('text-neutral-0');
  });

  it('danger aplica text-error-500 no Text', () => {
    render(<Button variant="danger">X</Button>);
    const span = screen.getByText('X');
    expect(span.getAttribute('data-classname')).toContain('text-error-500');
  });

  it('sm aplica text-sm no Text', () => {
    render(<Button size="sm">X</Button>);
    const span = screen.getByText('X');
    expect(span.getAttribute('data-classname')).toContain('text-sm');
  });
});

describe('Button — props padrão', () => {
  it('usa variant=primary quando não especificado', () => {
    render(<Button>X</Button>);
    const cls = screen.getByRole('button').getAttribute('data-classname')!;
    expect(cls).toContain('bg-primary-500');
  });

  it('usa size=md quando não especificado', () => {
    render(<Button>X</Button>);
    const cls = screen.getByRole('button').getAttribute('data-classname')!;
    expect(cls).toContain('px-4');
  });
});
