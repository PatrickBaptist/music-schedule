import styled from "styled-components";
import Button from "../buttons/Buttons";

export type MusicianOption = {
  value: string;
  label: string;
};

type MultiMusicianSelectProps = {
  label: string;
  options: MusicianOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  exclusiveValues?: string[];
};

const Field = styled.div`
  width: 100%;
`;

const Label = styled.span`
  display: block;
  margin-bottom: 5px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 7px;
`;

const Chip = styled(Button).attrs({ variant: "unstyled" })`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 30px;
  padding: 4px 9px;
  border: 1px solid color-mix(in srgb, var(--color-primary) 55%, var(--color-border));
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-primary) 15%, var(--color-input-bg));
  color: var(--color-input-text);
  cursor: pointer;
  font-size: 13px;

  span:last-child {
    font-size: 16px;
    line-height: 1;
  }
`;

const Picker = styled.details`
  position: relative;
  width: 100%;

  summary {
    min-height: 42px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 9px 12px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-input-bg);
    color: var(--color-input-text);
    cursor: pointer;
    list-style: none;
    font-size: 14px;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  summary::after {
    content: "⌄";
    color: var(--color-primary);
    font-size: 18px;
  }

  &[open] summary::after {
    transform: rotate(180deg);
  }
`;

const Options = styled.div`
  margin-top: 6px;
  max-height: 210px;
  overflow-y: auto;
  padding: 6px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface-muted);
  box-shadow: 0 12px 30px var(--color-shadow);
`;

const Option = styled.label`
  min-height: 40px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 8px;
  border-radius: 6px;
  color: var(--color-text);
  cursor: pointer;

  &:hover {
    background: color-mix(in srgb, var(--color-primary) 12%, transparent);
  }

  input {
    width: 18px;
    height: 18px;
    accent-color: var(--color-primary);
  }
`;

const Empty = styled.p`
  margin: 8px;
  color: var(--color-text-muted);
  font-size: 13px;
`;

const MultiMusicianSelect = ({
  label,
  options,
  selected,
  onChange,
  exclusiveValues = [],
}: MultiMusicianSelectProps) => {
  const uniqueOptions = Array.from(new Map(options.map((option) => [option.value, option])).values());
  const labelsByValue = new Map(uniqueOptions.map((option) => [option.value, option.label]));

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
      return;
    }

    if (exclusiveValues.includes(value)) {
      onChange([value]);
      return;
    }

    onChange([...selected.filter((item) => !exclusiveValues.includes(item)), value]);
  };

  return (
    <Field>
      <Label>{label}:</Label>
      {selected.length > 0 && (
        <Chips aria-label={`${label}: pessoas selecionadas`}>
          {selected.map((value) => (
            <Chip
              type="button"
              key={value}
              onClick={() => toggle(value)}
              aria-label={`Remover ${labelsByValue.get(value) || value} de ${label}`}
            >
              <span>{labelsByValue.get(value) || value}</span>
              <span aria-hidden="true">×</span>
            </Chip>
          ))}
        </Chips>
      )}
      <Picker>
        <summary>
          {selected.length === 0
            ? "Adicionar pessoa"
            : `${selected.length} ${selected.length === 1 ? "selecionado" : "selecionados"}`}
        </summary>
        <Options>
          {uniqueOptions.length === 0 ? (
            <Empty>Nenhuma pessoa disponível para esta função.</Empty>
          ) : (
            uniqueOptions.map((option) => (
              <Option key={option.value}>
                <input
                  type="checkbox"
                  checked={selected.includes(option.value)}
                  onChange={() => toggle(option.value)}
                />
                <span>{option.label}</span>
              </Option>
            ))
          )}
        </Options>
      </Picker>
    </Field>
  );
};

export default MultiMusicianSelect;
