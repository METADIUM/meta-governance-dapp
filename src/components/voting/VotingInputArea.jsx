import React, { useState } from 'react';
import cn from 'classnames/bind';
import { removeCommasFromNumber } from '../../util';

const VotingInputArea = ({
  type = 'default',
  disabled = false,
  readonly = false,
  inputType,
  placeholder,
  value,
  onChange,
  fixText,
  description,
  name,
  errType,
  errText,
  myForm,
  enterButton,
  onClick,
  prefix,
  superPrefix,
  Locked,
  maxLength = 256,
}) => {
  const [isFocus, setIsFocus] = useState(false);
  const [addrValue, setAddrValue] = useState('');

  return (
    <>
      <div
        className={cn(
          'input-wrap',
          inputType,
          type,
          isFocus && 'focus-on',
          disabled && 'disabled'
        )}>
        {inputType === 'multiline' ? (
          <>
            <div
              className={cn(
                'textarea-wrap',
                isFocus && 'focus-on',
                myForm && 'my-form'
              )}>
              <textarea
                name={name}
                placeholder={placeholder}
                disabled={disabled}
                maxLength={maxLength}
                onFocus={() => {
                  setIsFocus(true);
                }}
                onBlur={() => {
                  setIsFocus(false);
                }}
                onChange={(e) => {
                  onChange(e);
                  setAddrValue(e.target.value);
                }}
                value={value}
              />
              <div className='addr-wrap'>
                <span className='addr-length'>{addrValue.length}</span>/
                {maxLength}
              </div>
            </div>
            {errType && <span className={cn('error-massage')}>{errText}</span>}
            {/* 23.03.06 수정: description 컴포넌트 밖으로 구조 변경 */}
          </>
        ) : (
          <div
            className={cn(
              'input-top-area',
              prefix ? 'prefix' : '',
              enterButton && 'enter'
            )}>
            {prefix && <span>{prefix}</span>}
            {superPrefix && (
              <span className='super-prefix'>
                {superPrefix}
                <span> *</span>
              </span>
            )}
            <div
              className={cn(
                'input-area',
                type,
                inputType,
                isFocus && 'focus-on',
                !value && 'not-value',
                !enterButton && errType && 'error',
                readonly && 'readonly',
                superPrefix && 'superPrefix',
                errType && 'error',
                Locked && 'locked'
              )}>
              <input
                className={
                  enterButton &&
                  `${isFocus ? 'focus-on' : 'default'} 
                   ${!value && 'not-value'} 
                   ${errType && 'error'}
                   ${Locked && 'locked'}
                   `
                }
                type={'text'}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readonly}
                onChange={(e) => {
                  onChange(e);
                  setAddrValue(removeCommasFromNumber(e.target.value));
                }}
                value={value}
                name={name}
                onFocus={() => {
                  setIsFocus(true);
                }}
                onBlur={() => {
                  setIsFocus(false);
                }}
                maxLength={maxLength}
              />
              {superPrefix && !value && (
                <span className={cn('text-place')}>{fixText}</span>
              )}
              {inputType === 'suffix' && !value && Locked && (
                <span className={cn('text-place')}>{fixText}</span>
              )}
              {/* 23.03.06 수정 start: Prefix, Suffix text props 수정 */}
              {inputType === 'suffix' && value && (
                <span className={cn('text-place')}>{fixText}</span>
              )}
              {inputType === 'prefix' && value && (
                <span className={cn('text-place')}>{fixText}</span>
              )}
            </div>
            {errType && errText && (
              <div>
                <p className={cn('error-massage')}>{errText}</p>
              </div>
            )}

            {/* 23.03.06 수정: description 컴포넌트 밖으로 구조 변경
              <span className={cn("description")}>{description}</span>*/}
            {enterButton && (
              <button
                type='button'
                className={cn('input-button')}
                onClick={() => onClick(addrValue)}>
                {enterButton}
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default VotingInputArea;
