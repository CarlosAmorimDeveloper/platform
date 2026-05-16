'use strict';

import { getContainerClasses, getTextClasses } from '../src/components/Button/button-classes';

describe('getContainerClasses', () => {
  describe('base classes', () => {
    it('sempre inclui classes de layout base', () => {
      const result = getContainerClasses('primary', 'md', false, '');
      expect(result).toContain('items-center');
      expect(result).toContain('justify-center');
      expect(result).toContain('flex-row');
    });
  });

  describe('variante primary', () => {
    it('aplica fundo e borda primários', () => {
      const result = getContainerClasses('primary', 'md', false, '');
      expect(result).toContain('bg-primary-500');
      expect(result).toContain('border-primary-500');
    });

    it('inclui estado ativo', () => {
      const result = getContainerClasses('primary', 'md', false, '');
      expect(result).toContain('active:bg-primary-600');
    });
  });

  describe('variante secondary', () => {
    it('aplica fundo transparente com borda primária', () => {
      const result = getContainerClasses('secondary', 'md', false, '');
      expect(result).toContain('bg-transparent');
      expect(result).toContain('border-primary-500');
    });

    it('inclui estado ativo com fundo suave', () => {
      const result = getContainerClasses('secondary', 'md', false, '');
      expect(result).toContain('active:bg-primary-50');
    });
  });

  describe('variante ghost', () => {
    it('aplica fundo transparente sem borda', () => {
      const result = getContainerClasses('ghost', 'md', false, '');
      expect(result).toContain('bg-transparent');
      expect(result).not.toContain('border-');
    });

    it('inclui estado ativo com fundo suave', () => {
      const result = getContainerClasses('ghost', 'md', false, '');
      expect(result).toContain('active:bg-primary-50');
    });
  });

  describe('variante danger', () => {
    it('aplica fundo transparente sem borda', () => {
      const result = getContainerClasses('danger', 'md', false, '');
      expect(result).toContain('bg-transparent');
      expect(result).not.toContain('border-');
    });

    it('inclui estado ativo com fundo de erro suave', () => {
      const result = getContainerClasses('danger', 'md', false, '');
      expect(result).toContain('active:bg-error-50');
    });
  });

  describe('tamanho md', () => {
    it('aplica padding e border-radius corretos', () => {
      const result = getContainerClasses('primary', 'md', false, '');
      expect(result).toContain('px-4');
      expect(result).toContain('py-2');
      expect(result).toContain('rounded-md');
    });
  });

  describe('tamanho sm', () => {
    it('aplica padding e border-radius menores', () => {
      const result = getContainerClasses('primary', 'sm', false, '');
      expect(result).toContain('px-3');
      expect(result).toContain('py-1');
      expect(result).toContain('rounded-sm');
    });
  });

  describe('estado disabled', () => {
    it('adiciona opacity-50 quando disabled=true', () => {
      const result = getContainerClasses('primary', 'md', true, '');
      expect(result).toContain('opacity-50');
    });

    it('não adiciona opacity-50 quando disabled=false', () => {
      const result = getContainerClasses('primary', 'md', false, '');
      expect(result).not.toContain('opacity-50');
    });
  });

  describe('className extra', () => {
    it('inclui className extra fornecida', () => {
      const result = getContainerClasses('primary', 'md', false, 'mt-4');
      expect(result).toContain('mt-4');
    });

    it('não inclui string vazia no resultado final', () => {
      const result = getContainerClasses('primary', 'md', false, '');
      expect(result).not.toMatch(/\s{2,}/);
      expect(result.trim()).toBe(result);
    });

    it('combina className extra com as demais classes', () => {
      const result = getContainerClasses('ghost', 'sm', true, 'w-full');
      expect(result).toContain('w-full');
      expect(result).toContain('opacity-50');
      expect(result).toContain('px-3');
    });
  });
});

describe('getTextClasses', () => {
  it('sempre inclui font-medium', () => {
    expect(getTextClasses('primary', 'md')).toContain('font-medium');
    expect(getTextClasses('danger', 'sm')).toContain('font-medium');
  });

  describe('cores de texto por variante', () => {
    it('primary → texto branco (neutral-0)', () => {
      expect(getTextClasses('primary', 'md')).toContain('text-neutral-0');
    });

    it('secondary → texto primário', () => {
      expect(getTextClasses('secondary', 'md')).toContain('text-primary-500');
    });

    it('ghost → texto primário', () => {
      expect(getTextClasses('ghost', 'md')).toContain('text-primary-500');
    });

    it('danger → texto de erro', () => {
      expect(getTextClasses('danger', 'md')).toContain('text-error-500');
    });
  });

  describe('tamanho do texto por size', () => {
    it('md → text-base', () => {
      expect(getTextClasses('primary', 'md')).toContain('text-base');
    });

    it('sm → text-sm', () => {
      expect(getTextClasses('primary', 'sm')).toContain('text-sm');
    });
  });

  it('combina variante e tamanho corretamente', () => {
    const result = getTextClasses('danger', 'sm');
    expect(result).toContain('text-error-500');
    expect(result).toContain('text-sm');
    expect(result).toContain('font-medium');
  });
});
