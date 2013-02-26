/*!
 * JavaScript tag cloud builder v0.2
 * http://tagsonflags.com/
 *
 * Copyright 2013, Oleg Mazko
 * http://www.opensource.org/licenses/bsd-license.html
 */

function FlexTokenizer(input, progress) {

	function ClassicTokenizerImpl(zzReader)  {
	
	  /** This character denotes the end of file */
	  var YYEOF = -1;
	
	  /** initial size of the lookahead buffer */
	  var ZZ_BUFFERSIZE = 4096;
	
	  /** lexical states */
	  var YYINITIAL = 0;
	
	  /**
	   * ZZ_LEXSTATE[l] is the state in the DFA for the lexical state l
	   * ZZ_LEXSTATE[l+1] is the state in the DFA for the lexical state l
	   *                  at the beginning of a line
	   * l is of the form l = 2*k, k a non negative integer
	   */
	  var ZZ_LEXSTATE = [ 
	     0, 0
	  ];
	
	  /** 
	   * Translates characters to character classes
	   */
	  var ZZ_CMAP_PACKED = 
	    "\11\0\1\0\1\15\1\0\1\0\1\14\22\0\1\0\5\0\1\5"+
	    "\1\3\4\0\1\11\1\7\1\4\1\11\12\2\6\0\1\6\32\12"+
	    "\4\0\1\10\1\0\32\12\57\0\1\12\12\0\1\12\4\0\1\12"+
	    "\5\0\27\12\1\0\37\12\1\0\u0128\12\2\0\22\12\34\0\136\12"+
	    "\2\0\11\12\2\0\7\12\16\0\2\12\16\0\5\12\11\0\1\12"+
	    "\213\0\1\12\13\0\1\12\1\0\3\12\1\0\1\12\1\0\24\12"+
	    "\1\0\54\12\1\0\10\12\2\0\32\12\14\0\202\12\12\0\71\12"+
	    "\2\0\2\12\2\0\2\12\3\0\46\12\2\0\2\12\67\0\46\12"+
	    "\2\0\1\12\7\0\47\12\110\0\33\12\5\0\3\12\56\0\32\12"+
	    "\5\0\13\12\25\0\12\2\7\0\143\12\1\0\1\12\17\0\2\12"+
	    "\11\0\12\2\3\12\23\0\1\12\1\0\33\12\123\0\46\12\u015f\0"+
	    "\65\12\3\0\1\12\22\0\1\12\7\0\12\12\4\0\12\2\25\0"+
	    "\10\12\2\0\2\12\2\0\26\12\1\0\7\12\1\0\1\12\3\0"+
	    "\4\12\42\0\2\12\1\0\3\12\4\0\12\2\2\12\23\0\6\12"+
	    "\4\0\2\12\2\0\26\12\1\0\7\12\1\0\2\12\1\0\2\12"+
	    "\1\0\2\12\37\0\4\12\1\0\1\12\7\0\12\2\2\0\3\12"+
	    "\20\0\7\12\1\0\1\12\1\0\3\12\1\0\26\12\1\0\7\12"+
	    "\1\0\2\12\1\0\5\12\3\0\1\12\22\0\1\12\17\0\1\12"+
	    "\5\0\12\2\25\0\10\12\2\0\2\12\2\0\26\12\1\0\7\12"+
	    "\1\0\2\12\2\0\4\12\3\0\1\12\36\0\2\12\1\0\3\12"+
	    "\4\0\12\2\25\0\6\12\3\0\3\12\1\0\4\12\3\0\2\12"+
	    "\1\0\1\12\1\0\2\12\3\0\2\12\3\0\3\12\3\0\10\12"+
	    "\1\0\3\12\55\0\11\2\25\0\10\12\1\0\3\12\1\0\27\12"+
	    "\1\0\12\12\1\0\5\12\46\0\2\12\4\0\12\2\25\0\10\12"+
	    "\1\0\3\12\1\0\27\12\1\0\12\12\1\0\5\12\44\0\1\12"+
	    "\1\0\2\12\4\0\12\2\25\0\10\12\1\0\3\12\1\0\27\12"+
	    "\1\0\20\12\46\0\2\12\4\0\12\2\25\0\22\12\3\0\30\12"+
	    "\1\0\11\12\1\0\1\12\2\0\7\12\71\0\1\1\60\12\1\1"+
	    "\2\12\14\1\7\12\11\1\12\2\47\0\2\12\1\0\1\12\2\0"+
	    "\2\12\1\0\1\12\2\0\1\12\6\0\4\12\1\0\7\12\1\0"+
	    "\3\12\1\0\1\12\1\0\1\12\2\0\2\12\1\0\4\12\1\0"+
	    "\2\12\11\0\1\12\2\0\5\12\1\0\1\12\11\0\12\2\2\0"+
	    "\2\12\42\0\1\12\37\0\12\2\26\0\10\12\1\0\42\12\35\0"+
	    "\4\12\164\0\42\12\1\0\5\12\1\0\2\12\25\0\12\2\6\0"+
	    "\6\12\112\0\46\12\12\0\47\12\11\0\132\12\5\0\104\12\5\0"+
	    "\122\12\6\0\7\12\1\0\77\12\1\0\1\12\1\0\4\12\2\0"+
	    "\7\12\1\0\1\12\1\0\4\12\2\0\47\12\1\0\1\12\1\0"+
	    "\4\12\2\0\37\12\1\0\1\12\1\0\4\12\2\0\7\12\1\0"+
	    "\1\12\1\0\4\12\2\0\7\12\1\0\7\12\1\0\27\12\1\0"+
	    "\37\12\1\0\1\12\1\0\4\12\2\0\7\12\1\0\47\12\1\0"+
	    "\23\12\16\0\11\2\56\0\125\12\14\0\u026c\12\2\0\10\12\12\0"+
	    "\32\12\5\0\113\12\225\0\64\12\54\0\12\2\46\0\12\2\6\0"+
	    "\130\12\10\0\51\12\u0557\0\234\12\4\0\132\12\6\0\26\12\2\0"+
	    "\6\12\2\0\46\12\2\0\6\12\2\0\10\12\1\0\1\12\1\0"+
	    "\1\12\1\0\1\12\1\0\37\12\2\0\65\12\1\0\7\12\1\0"+
	    "\1\12\3\0\3\12\1\0\7\12\3\0\4\12\2\0\6\12\4\0"+
	    "\15\12\5\0\3\12\1\0\7\12\202\0\1\12\202\0\1\12\4\0"+
	    "\1\12\2\0\12\12\1\0\1\12\3\0\5\12\6\0\1\12\1\0"+
	    "\1\12\1\0\1\12\1\0\4\12\1\0\3\12\1\0\7\12\u0ecb\0"+
	    "\2\12\52\0\5\12\12\0\1\13\124\13\10\13\2\13\2\13\132\13"+
	    "\1\13\3\13\6\13\50\13\3\13\1\0\136\12\21\0\30\12\70\0"+
	    "\20\13\u0100\0\200\13\200\0\u19b6\13\12\13\100\0\u51a6\13\132\13\u048d\12"+
	    "\u0773\0\u2ba4\12\u215c\0\u012e\13\322\13\7\12\14\0\5\12\5\0\1\12"+
	    "\1\0\12\12\1\0\15\12\1\0\5\12\1\0\1\12\1\0\2\12"+
	    "\1\0\2\12\1\0\154\12\41\0\u016b\12\22\0\100\12\2\0\66\12"+
	    "\50\0\14\12\164\0\3\12\1\0\1\12\1\0\207\12\23\0\12\2"+
	    "\7\0\32\12\6\0\32\12\12\0\1\13\72\13\37\12\3\0\6\12"+
	    "\2\0\6\12\2\0\6\12\2\0\3\12\43\0";
	
	  /** 
	   * Translates characters to character classes
	   */
	  var ZZ_CMAP = zzUnpackCMap(ZZ_CMAP_PACKED);
	
	  /** 
	   * Translates DFA states to action switch labels.
	   */
	
	  var ZZ_ACTION_PACKED_0 =
	    "\1\0\1\1\3\2\1\3\1\1\13\0\1\2\3\4"+
	    "\2\0\1\5\1\0\1\5\3\4\6\5\1\6\1\4"+
	    "\2\7\1\10\1\0\1\10\3\0\2\10\1\11\1\12"+
	    "\1\4";
	
	  function zzUnpackAction() {
	    var result = new Array(51);
	    var offset = 0;
	    offset = zzUnpackAction_helper(ZZ_ACTION_PACKED_0, offset, result);
	    return result;
	  }
	
	  function zzUnpackAction_helper( packed, offset, result) {
	    var i = 0;       /* index in packed string  */
	    var j = offset;  /* index in unpacked array */
	    var l = packed.length;
	    while (i < l) {
	      var count = packed.charCodeAt(i++);
	      var value = packed.charCodeAt(i++);
	      do result[j++] = value; while (--count > 0);
	    }
	    return j;
	  }
	
	  var ZZ_ACTION = zzUnpackAction();
	
	  /* error codes */
	  var ZZ_UNKNOWN_ERROR = 0;
	  var ZZ_NO_MATCH = 1;
	  var ZZ_PUSHBACK_2BIG = 2;
	
	  /* error messages for the codes above */
	  var ZZ_ERROR_MSG = [
	    "Unkown internal scanner error",
	    "Error: could not match input",
	    "Error: pushback value was too large"
	  ];
	
	  /** the input device */
	  var zzReader;
	
	  /** the current state of the DFA */
	  var zzState = 0;
	
	  /** the current lexical state */
	  var zzLexicalState = YYINITIAL;
	
	  /** this buffer contains the current text to be matched and is
	      the source of the yytext() string */
	  var zzBuffer = new Array(ZZ_BUFFERSIZE);
	
	  /** the textposition at the last accepting state */
	  var zzMarkedPos = 0;
	
	  /** the current text position in the buffer */
	  var zzCurrentPos = 0;
	
	  /** startRead marks the beginning of the yytext() string in the buffer */
	  var zzStartRead = 0;
	
	  /** endRead marks the last character in the buffer, that has been read
	      from input */
	  var zzEndRead = 0;
	
	  /** number of newlines encountered up to the start of the matched text */
	  var yyline = 0;
	
	  /** the number of characters up to the start of the matched text */
	  var yychar = 0;
	
	  /**
	   * the number of characters from the last newline up to the start of the 
	   * matched text
	   */
	  var yycolumn = 0;
	
	  /** 
	   * zzAtBOL == true <=> the scanner is currently at the beginning of a line
	   */
	  var zzAtBOL = true;
	
	  /** zzAtEOF == true <=> the scanner is at the EOF */
	  var zzAtEOF = false;
	
	  /** denotes if the user-EOF-code has already been executed */
	  var zzEOFDone = false;
	
	  /* user code: */
	
	  this.yychar = function() {
	    return yychar;
	  }
	
	
	
	  /**
	   * Creates a new scanner
	   * There is also a java.io.InputStream version of this constructor.
	   *
	   * @param   in  the java.io.Reader to read input from.
	   */
	
	  /** 
	   * Unpacks the compressed character translation table.
	   *
	   * @param packed   the packed character translation table
	   * @return         the unpacked character translation table
	   */
	  function zzUnpackCMap(packed) {
	    var map = new Array(0x10000);
	    var i = 0;  /* index in packed string  */
	    var j = 0;  /* index in unpacked array */
	    while (i < 1154) {
	      var  count = packed.charCodeAt(i++);
	      var  value = packed.charCodeAt(i++);
	      do map[j++] = value; while (--count > 0);
	    }
	    return map;
	  }
	
	
	  /**
	   * Refills the input buffer.
	   *
	   * @return      <code>false</code>, iff there was new input.
	   * 
	   * @exception   java.io.IOException  if any I/O-Error occurs
	   */
	  function zzRefill() {
	
	    /* first: make room (if you can) */
	    if (zzStartRead > 0) {
	      //System.arraycopy(zzBuffer, zzStartRead,
	      //                 zzBuffer, 0,
	      //                 zzEndRead-zzStartRead);
	
	      var zzBuffer_s = zzBuffer.slice(zzStartRead, zzEndRead);
	      zzBuffer = zzBuffer.slice(zzBuffer_s.length);
	      zzBuffer = zzBuffer_s.concat(zzBuffer);
	
	      /* translate stored positions */
	      zzEndRead-= zzStartRead;
	      zzCurrentPos-= zzStartRead;
	      zzMarkedPos-= zzStartRead;
	      zzStartRead = 0;
	    }
	
	    /* is the buffer big enough? */
	    if (zzCurrentPos >= zzBuffer.length) {
	      throw "Fix me! zzRefill() blow zzBuffer -> need to be implemented ?";
	      /* if not: blow it up */
	      //char newBuffer[] = new char[zzCurrentPos*2];
	      //System.arraycopy(zzBuffer, 0, newBuffer, 0, zzBuffer.length);
	      //zzBuffer = newBuffer;
	      //zzBuffer[(zzCurrentPos*2) - 1] = undefined;
	    }
	
	    /* finally: fill the buffer with new input */
	    var numRead = zzReader.read(zzBuffer, zzEndRead,
	                                            zzBuffer.length-zzEndRead);
	
	    if (numRead > 0) {
	      zzEndRead+= numRead;
	      return false;
	    }
	
	    // unlikely but not impossible: read 0 characters, but not at end of stream    
	    if (numRead === 0) {
	      throw "Fix me! numRead === 0 -> need to be implemented ?";
	      //var c = zzReader.read();
	      //if (c == -1) {
	      //  return true;
	      //} else {
	      //  zzBuffer[zzEndRead++] = c;
	      //  return false;
	      //}     
	    }
	
	    // numRead < 0
	    return true;
	  }
	
	  /**
	   * Returns the text matched by the current regular expression.
	   */
	  this.yytext = function() {
	    var buffer = zzBuffer.slice(zzStartRead, zzMarkedPos);
	    return String.fromCharCode.apply(String, buffer);
	    //return new String( zzBuffer, zzStartRead, zzMarkedPos-zzStartRead );
	  }
	
	
	  /**
	   * Returns the length of the matched text region.
	   */
	  function yylength() {
	    return zzMarkedPos-zzStartRead;
	  }
	
	
	  /**
	   * Reports an error that occured while scanning.
	   *
	   * In a wellformed scanner (no or only correct usage of 
	   * yypushback(int) and a match-all fallback rule) this method 
	   * will only be called with things that "Can't Possibly Happen".
	   * If this method is called, something is seriously wrong
	   * (e.g. a JFlex bug producing a faulty scanner etc.).
	   *
	   * Usual syntax/scanner level error handling should be done
	   * in error fallback rules.
	   *
	   * @param   errorCode  the code of the errormessage to display
	   */
	  function zzScanError(errorCode)  {
	    var message;
	    try {
	      message = ZZ_ERROR_MSG[errorCode];
	    }
	    catch (err) {
	      message = ZZ_ERROR_MSG[ZZ_UNKNOWN_ERROR];
	    }
	
	    throw new Error(message);
	  } 
	
	
	  /**
	   * Pushes the specified amount of characters back into the input stream.
	   *
	   * They will be read again by then next call of the scanning method
	   *
	   * @param number  the number of characters to be read again.
	   *                This number must not be greater than yylength()!
	   */
	  function yypushback(number)  {
	    if ( number > yylength() )
	      zzScanError(ZZ_PUSHBACK_2BIG);
	
	    zzMarkedPos -= number;
	  }
	
	
	  /**
	   * Resumes scanning until the next regular expression is matched,
	   * the end of input is encountered or an I/O-Error occurs.
	   *
	   * @return      the next token
	   * @exception   java.io.IOException  if any I/O-Error occurs
	   */
	  this.getNextToken = function()  {
	    var zzInput;
	    var zzAction;
	
	    // cached fields:
	    var zzCurrentPosL;
	    var zzMarkedPosL;
	    var zzEndReadL = zzEndRead;
	    var zzBufferL = zzBuffer;
	    var zzCMapL = ZZ_CMAP;
	
	
	    while (true) {
	      zzMarkedPosL = zzMarkedPos;
	
	      yychar+= zzMarkedPosL-zzStartRead;
	
	      zzAction = -1;
	
	      zzCurrentPosL = zzCurrentPos = zzStartRead = zzMarkedPosL;
	  
	      zzState = ZZ_LEXSTATE[zzLexicalState];
	
	
	      zzForAction: {
	        while (true) {
	    
	          if (zzCurrentPosL < zzEndReadL)
	            zzInput = zzBufferL[zzCurrentPosL++];
	          else if (zzAtEOF) {
	            zzInput = YYEOF;
	            break zzForAction;
	          }
	          else {
	            // store back cached positions
	            zzCurrentPos  = zzCurrentPosL;
	            zzMarkedPos   = zzMarkedPosL;
	            var eof = zzRefill();
	            // get translated positions and possibly new buffer
	            zzCurrentPosL  = zzCurrentPos;
	            zzMarkedPosL   = zzMarkedPos;
	            zzBufferL      = zzBuffer;
	            zzEndReadL     = zzEndRead;
	            if (eof) {
	              zzInput = YYEOF;
	              break zzForAction;
	            }
	            else {
	              zzInput = zzBufferL[zzCurrentPosL++];
	            }
	          }
	          zzInput = zzCMapL[zzInput];
	
	          var zzIsFinal = false;
	          var zzNoLookAhead = false;
	
	          zzForNext: { switch (zzState) {
	            case 0:
	              switch (zzInput) {
	                case 1: zzIsFinal = true; zzState = 2; break zzForNext;
	                case 2: zzIsFinal = true; zzState = 3; break zzForNext;
	                case 10: zzIsFinal = true; zzState = 4; break zzForNext;
	                case 11: zzIsFinal = true; zzNoLookAhead = true; zzState = 5; break zzForNext;
	                case 12: zzIsFinal = true; zzState = 6; break zzForNext;
	                default: zzIsFinal = true; zzNoLookAhead = true; zzState = 1; break zzForNext;
	              }
	
	            case 2:
	              switch (zzInput) {
	                case 1: 
	                case 2: 
	                case 10: zzIsFinal = true; break zzForNext;
	                case 4: zzState = 7; break zzForNext;
	                case 6: zzState = 8; break zzForNext;
	                case 7: 
	                case 8: zzState = 9; break zzForNext;
	                case 9: zzState = 10; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 3:
	              switch (zzInput) {
	                case 1: zzIsFinal = true; zzState = 2; break zzForNext;
	                case 2: 
	                case 10: zzIsFinal = true; break zzForNext;
	                case 6: zzState = 8; break zzForNext;
	                case 4: zzState = 11; break zzForNext;
	                case 7: 
	                case 8: zzState = 12; break zzForNext;
	                case 9: zzState = 13; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 4:
	              switch (zzInput) {
	                case 1: zzIsFinal = true; zzState = 2; break zzForNext;
	                case 2: zzIsFinal = true; zzState = 3; break zzForNext;
	                case 7: 
	                case 8: zzState = 9; break zzForNext;
	                case 9: zzState = 10; break zzForNext;
	                case 3: zzState = 14; break zzForNext;
	                case 4: zzState = 15; break zzForNext;
	                case 5: zzState = 16; break zzForNext;
	                case 6: zzState = 17; break zzForNext;
	                case 10: zzIsFinal = true; zzState = 18; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 6:
	              switch (zzInput) {
	                case 13: zzIsFinal = true; zzNoLookAhead = true; zzState = 1; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 7:
	              switch (zzInput) {
	                case 1: zzIsFinal = true; zzState = 19; break zzForNext;
	                case 2: zzIsFinal = true; zzState = 20; break zzForNext;
	                case 10: zzIsFinal = true; zzState = 21; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 8:
	              switch (zzInput) {
	                case 1: 
	                case 2: 
	                case 10: zzState = 22; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 9:
	              switch (zzInput) {
	                case 1: zzState = 23; break zzForNext;
	                case 2: zzIsFinal = true; zzState = 24; break zzForNext;
	                case 10: zzState = 25; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 10:
	              switch (zzInput) {
	                case 10: break zzForNext;
	                case 2: zzIsFinal = true; zzState = 26; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 11:
	              switch (zzInput) {
	                case 1: zzIsFinal = true; zzState = 27; break zzForNext;
	                case 2: zzIsFinal = true; zzState = 28; break zzForNext;
	                case 10: zzIsFinal = true; zzState = 29; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 12:
	              switch (zzInput) {
	                case 1: zzIsFinal = true; zzState = 30; break zzForNext;
	                case 2: zzIsFinal = true; zzState = 31; break zzForNext;
	                case 10: zzIsFinal = true; zzState = 32; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 13:
	              switch (zzInput) {
	                case 1: zzIsFinal = true; zzState = 33; break zzForNext;
	                case 2: zzIsFinal = true; zzState = 34; break zzForNext;
	                case 10: zzIsFinal = true; zzState = 35; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 14:
	              switch (zzInput) {
	                case 10: zzIsFinal = true; zzState = 36; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 15:
	              switch (zzInput) {
	                case 1: zzIsFinal = true; zzState = 19; break zzForNext;
	                case 2: zzIsFinal = true; zzState = 20; break zzForNext;
	                case 10: zzIsFinal = true; zzState = 37; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 16:
	              switch (zzInput) {
	                case 10: zzIsFinal = true; zzState = 38; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 17:
	              switch (zzInput) {
	                case 1: 
	                case 2: zzState = 22; break zzForNext;
	                case 10: zzIsFinal = true; zzState = 39; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 18:
	              switch (zzInput) {
	                case 1: zzIsFinal = true; zzState = 2; break zzForNext;
	                case 2: zzIsFinal = true; zzState = 3; break zzForNext;
	                case 4: zzState = 7; break zzForNext;
	                case 7: 
	                case 8: zzState = 9; break zzForNext;
	                case 9: zzState = 10; break zzForNext;
	                case 3: zzState = 14; break zzForNext;
	                case 5: zzState = 16; break zzForNext;
	                case 6: zzState = 17; break zzForNext;
	                case 10: zzIsFinal = true; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 19:
	              switch (zzInput) {
	                case 6: zzState = 8; break zzForNext;
	                case 1: 
	                case 2: 
	                case 10: zzIsFinal = true; break zzForNext;
	                case 4: zzIsFinal = true; zzState = 40; break zzForNext;
	                case 7: 
	                case 8: zzState = 41; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 20:
	              switch (zzInput) {
	                case 6: zzState = 8; break zzForNext;
	                case 1: zzIsFinal = true; zzState = 19; break zzForNext;
	                case 2: 
	                case 10: zzIsFinal = true; break zzForNext;
	                case 4: zzIsFinal = true; zzState = 42; break zzForNext;
	                case 7: 
	                case 8: zzState = 43; break zzForNext;
	                case 9: zzState = 44; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 21:
	              switch (zzInput) {
	                case 6: zzState = 8; break zzForNext;
	                case 1: zzIsFinal = true; zzState = 19; break zzForNext;
	                case 2: zzIsFinal = true; zzState = 20; break zzForNext;
	                case 10: zzIsFinal = true; break zzForNext;
	                case 4: zzIsFinal = true; zzState = 40; break zzForNext;
	                case 7: 
	                case 8: zzState = 41; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 22:
	              switch (zzInput) {
	                case 1: 
	                case 2: 
	                case 10: break zzForNext;
	                case 4: 
	                case 7: zzState = 45; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 23:
	              switch (zzInput) {
	                case 6: zzState = 8; break zzForNext;
	                case 1: 
	                case 2: 
	                case 10: break zzForNext;
	                case 4: 
	                case 7: 
	                case 8: zzState = 41; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 24:
	              switch (zzInput) {
	                case 6: zzState = 8; break zzForNext;
	                case 1: zzState = 23; break zzForNext;
	                case 2: 
	                case 10: zzIsFinal = true; break zzForNext;
	                case 4: 
	                case 7: 
	                case 8: zzState = 43; break zzForNext;
	                case 9: zzState = 44; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 25:
	              switch (zzInput) {
	                case 6: zzState = 8; break zzForNext;
	                case 1: zzState = 23; break zzForNext;
	                case 2: zzIsFinal = true; zzState = 24; break zzForNext;
	                case 10: break zzForNext;
	                case 4: 
	                case 7: 
	                case 8: zzState = 41; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 26:
	              switch (zzInput) {
	                case 2: 
	                case 10: zzIsFinal = true; break zzForNext;
	                case 4: 
	                case 7: 
	                case 8: 
	                case 9: zzState = 44; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 27:
	              switch (zzInput) {
	                case 6: zzState = 8; break zzForNext;
	                case 7: 
	                case 8: zzState = 9; break zzForNext;
	                case 9: zzState = 10; break zzForNext;
	                case 1: 
	                case 2: 
	                case 10: zzIsFinal = true; break zzForNext;
	                case 4: zzIsFinal = true; zzState = 46; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 28:
	              switch (zzInput) {
	                case 6: zzState = 8; break zzForNext;
	                case 7: 
	                case 8: zzState = 12; break zzForNext;
	                case 9: zzState = 13; break zzForNext;
	                case 1: zzIsFinal = true; zzState = 27; break zzForNext;
	                case 2: 
	                case 10: zzIsFinal = true; break zzForNext;
	                case 4: zzIsFinal = true; zzState = 47; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 29:
	              switch (zzInput) {
	                case 6: zzState = 8; break zzForNext;
	                case 7: 
	                case 8: zzState = 9; break zzForNext;
	                case 9: zzState = 10; break zzForNext;
	                case 1: zzIsFinal = true; zzState = 27; break zzForNext;
	                case 2: zzIsFinal = true; zzState = 28; break zzForNext;
	                case 10: zzIsFinal = true; break zzForNext;
	                case 4: zzIsFinal = true; zzState = 46; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 30:
	              switch (zzInput) {
	                case 6: zzState = 8; break zzForNext;
	                case 4: 
	                case 7: 
	                case 8: zzState = 9; break zzForNext;
	                case 9: zzState = 10; break zzForNext;
	                case 1: 
	                case 2: 
	                case 10: zzIsFinal = true; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 31:
	              switch (zzInput) {
	                case 6: zzState = 8; break zzForNext;
	                case 4: 
	                case 7: 
	                case 8: zzState = 12; break zzForNext;
	                case 9: zzState = 13; break zzForNext;
	                case 1: zzIsFinal = true; zzState = 30; break zzForNext;
	                case 2: 
	                case 10: zzIsFinal = true; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 32:
	              switch (zzInput) {
	                case 6: zzState = 8; break zzForNext;
	                case 4: 
	                case 7: 
	                case 8: zzState = 9; break zzForNext;
	                case 9: zzState = 10; break zzForNext;
	                case 1: zzIsFinal = true; zzState = 30; break zzForNext;
	                case 2: zzIsFinal = true; zzState = 31; break zzForNext;
	                case 10: zzIsFinal = true; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 33:
	              switch (zzInput) {
	                case 4: 
	                case 7: 
	                case 8: 
	                case 9: zzState = 10; break zzForNext;
	                case 1: 
	                case 2: 
	                case 10: zzIsFinal = true; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 34:
	              switch (zzInput) {
	                case 4: 
	                case 7: 
	                case 8: 
	                case 9: zzState = 13; break zzForNext;
	                case 1: zzIsFinal = true; zzState = 33; break zzForNext;
	                case 2: 
	                case 10: zzIsFinal = true; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 35:
	              switch (zzInput) {
	                case 4: 
	                case 7: 
	                case 8: 
	                case 9: zzState = 10; break zzForNext;
	                case 1: zzIsFinal = true; zzState = 33; break zzForNext;
	                case 2: zzIsFinal = true; zzState = 34; break zzForNext;
	                case 10: zzIsFinal = true; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 36:
	              switch (zzInput) {
	                case 3: zzState = 14; break zzForNext;
	                case 10: zzIsFinal = true; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 37:
	              switch (zzInput) {
	                case 6: zzState = 8; break zzForNext;
	                case 1: zzIsFinal = true; zzState = 19; break zzForNext;
	                case 2: zzIsFinal = true; zzState = 20; break zzForNext;
	                case 10: zzIsFinal = true; zzState = 21; break zzForNext;
	                case 7: 
	                case 8: zzState = 41; break zzForNext;
	                case 4: zzIsFinal = true; zzState = 48; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 38:
	              switch (zzInput) {
	                case 10: zzIsFinal = true; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 39:
	              switch (zzInput) {
	                case 1: 
	                case 2: zzState = 22; break zzForNext;
	                case 10: zzIsFinal = true; break zzForNext;
	                case 4: 
	                case 7: zzState = 45; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 40:
	              switch (zzInput) {
	                case 1: 
	                case 2: 
	                case 10: zzIsFinal = true; zzState = 19; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 41:
	              switch (zzInput) {
	                case 1: 
	                case 2: 
	                case 10: zzState = 23; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 42:
	              switch (zzInput) {
	                case 1: 
	                case 2: 
	                case 10: zzIsFinal = true; zzState = 27; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 43:
	              switch (zzInput) {
	                case 1: 
	                case 2: 
	                case 10: zzIsFinal = true; zzState = 30; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 44:
	              switch (zzInput) {
	                case 1: 
	                case 2: 
	                case 10: zzIsFinal = true; zzState = 33; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 45:
	              switch (zzInput) {
	                case 1: 
	                case 2: 
	                case 10: zzIsFinal = true; zzState = 49; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 46:
	              switch (zzInput) {
	                case 1: zzIsFinal = true; zzState = 19; break zzForNext;
	                case 2: zzIsFinal = true; zzState = 20; break zzForNext;
	                case 10: zzIsFinal = true; zzState = 21; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 47:
	              switch (zzInput) {
	                case 1: zzIsFinal = true; zzState = 27; break zzForNext;
	                case 2: zzIsFinal = true; zzState = 28; break zzForNext;
	                case 10: zzIsFinal = true; zzState = 29; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 48:
	              switch (zzInput) {
	                case 1: 
	                case 2: zzIsFinal = true; zzState = 19; break zzForNext;
	                case 10: zzIsFinal = true; zzState = 50; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 49:
	              switch (zzInput) {
	                case 4: 
	                case 7: zzState = 45; break zzForNext;
	                case 1: 
	                case 2: 
	                case 10: zzIsFinal = true; break zzForNext;
	                default: break zzForAction;
	              }
	
	            case 50:
	              switch (zzInput) {
	                case 6: zzState = 8; break zzForNext;
	                case 1: 
	                case 2: 
	                case 10: zzIsFinal = true; zzState = 19; break zzForNext;
	                case 7: 
	                case 8: zzState = 41; break zzForNext;
	                case 4: zzIsFinal = true; zzState = 48; break zzForNext;
	                default: break zzForAction;
	              }
	
	            default:
	              // if this is ever reached, there is a serious bug in JFlex
	              zzScanError(ZZ_UNKNOWN_ERROR);
	              break;
	          } }
	
	          if ( zzIsFinal ) {
	            zzAction = zzState;
	            zzMarkedPosL = zzCurrentPosL;
	            if ( zzNoLookAhead ) break zzForAction;
	          }
	
	        }
	      }
	
	      // store back cached position
	      zzMarkedPos = zzMarkedPosL;
	
	      switch (zzAction < 0 ? zzAction : ZZ_ACTION[zzAction]) {
	        case 1: 
	          { /* Break so we don't hit fall-through warning: */ break;/* ignore */
	          }
	        case 11: break;
	        case 2: 
	          { return "ALPHANUM";
	          }
	        case 12: break;
	        case 3: 
	          { return "CJ";
	          }
	        case 13: break;
	        case 4: 
	          { return "HOST";
	          }
	        case 14: break;
	        case 5: 
	          { return "NUM";
	          }
	        case 15: break;
	        case 6: 
	          { return "APOSTROPHE";
	          }
	        case 16: break;
	        case 7: 
	          { return "COMPANY";
	          }
	        case 17: break;
	        case 8: 
	          { return "ACRONYM_DEP";
	          }
	        case 18: break;
	        case 9: 
	          { return "ACRONYM";
	          }
	        case 19: break;
	        case 10: 
	          { return "EMAIL";
	          }
	        case 20: break;
	        default: 
	          if (zzInput == YYEOF && zzStartRead == zzCurrentPos) {
	            zzAtEOF = true;
	            return null;
	          } 
	          else {
	            zzScanError(ZZ_NO_MATCH);
	          }
	      }
	    }
	  }
	
	
	}

	function StringReader(input) {
	
		/* Java origin impl - openjdk/jdk/src/share/classes/java/io/StringReader.java. Exceptions skipped - JFlex don't use them */
	
		var next = 0, inputLength = input.length;
	
		this.read = function(cbuf, off, len) {
	                
			if (arguments.length !== 3) {
				throw "Expected 3 arguments passed, found: " + arguments.length;
			}
	
			if (!len) {
				return 0;
			}
	
			if (next >= inputLength) {
				return -1;
			}
	                         
			var n = Math.min(inputLength - next, len), nT = n;
	
	                while (nT--) {
				cbuf[off + nT] = input.charCodeAt(next + nT);
			}
	
			next += n;	
			return n;
		}
	}

	var impl = new ClassicTokenizerImpl(new StringReader(input));

	function Token(term, start, end) {
		this.term = term;
		this.offset = [];
		this.boost = 1;
		this.addOffset(start, end);
	}
	
	Token.prototype.addOffset = function(start, end) {
		if (start < end)
			return this.offset.push({
						"start" : start,
						"end" : end
					});
		else {
			throw "Bad token offset start: " + start + ", end: " + end;
		}
	}
	
	Token.prototype.clone = function() {
	        function CloneToken() {};
	        CloneToken.prototype = Token.prototype;
		var cloneToken = new CloneToken();
		cloneToken.offset = this.offset.slice();
		cloneToken.boost = this.boost;
	        cloneToken.term = this.term;
	
		return cloneToken;
	}

	this.incrementToken = function() {

		var token = impl.getNextToken();
		if (token === null) return null;

	var inputLength = input.length;

		if (progress) {
			progress(impl.yychar(), inputLength);
		}

		var content = impl.yytext();
		return new Token(content, impl.yychar(), impl.yychar() + content.length);
	}
}
