---
layout: ../../layouts/PostsLayout.astro
title: ArchLinux Btrfs 磁盘加密安装
lang: zh-CN
pubDate: 2022-07-25T11:45:16.013Z
updatedDate: 2022-07-25T11:45:16.872Z
tags:
  - ArchLinux
  - Btrfs
description: ArchLinux Btrfs 磁盘加密安装配置流程
---
## 进行联网

### 有线

默认启用 DHCP 客户端如果使用网线就能直接连接网络

```shell
ip a
```

### 无线

先使用 `iwctl` 查看是否有无线网卡

```shell
iwctl station list
```

![iwctl检查不到网卡](/images/uploads/pasted-image-20220510195833.png "iwctl检查不到网卡")

如果没有找到可能是无线网卡被 `rfkill` 禁用了，通过以下命令解除禁用

```shell
rfkill unblock all
```

解除禁用后使用 `iwctl` 连接网络

## 设置 NTP

```shell
timedatectl set-ntp true
```

## 更换 pacman 换源

reflector 自动换源和手动换源选择其一即可

### reflector

通过 reflector 自动选择最快的源

```shell
reflector -c China -a 6 --sort rate --save /etc/pacman.d/mirrorlist
```

### 手动更换中科大源

编辑 `/etc/pacman.d/mirrorlist` ，在文件的最顶端添加

```
Server = https://mirrors.ustc.edu.cn/archlinux/$repo/os/$arch
```

换源之后进行更新

```shell
pacman -Sy
```

## 磁盘操作

### 查看磁盘

使用 `lsblk` 查看当前系统存在的磁盘

```shell
lsblk 
```

### 设置分区格式

使用 `parted` 设置磁盘分区格式 (**注意: 更换分区格式磁盘数据会丢失**)

```shell
parted /dev/nvme0n1
```

在 parted shell 里执行

```parted
(parted) mktable
New disk label type? gpt
(parted) quit
```

### 分区

通过 `cfdisk` 命令通过 TUI 对磁盘进行分区

```shell
cfdisk /dev/nvme0n1
```

分区要求

1. 512M EFI 分区 (不加密)
2. 512M BOOT 分区 (不加密)
3. ~~8G SWAP 交换分区 (加密) （内存小于 8G 交换分区和内存同大小，大于 8G 交换分区大小固定 8G)~~
4. 剩下加入 root 分区，通过btrfs 卷来进行功能划分

![分区截图](/images/uploads/rmnrsjz7sr.png "分区截图")

### 格式化非加密分区

格式化 `efi`, `boot` 分区

```shell
mkfs.vfat /dev/nvme0n1p1
mkfs.ext4 /dev/nvme0n1p2
```

### 选择加密算法格式化 root 分区

#### 测试加密算法性能

首先查看各种加密算法在当前CPU下的性能

```shell
cryptsetup benchmark
```

![benchmark结果截图](/images/uploads/pasted-image-20220510212431.png "benchmark结果截图")

综合加解密速度和安全性，我这里选择 `aes-xts` 密钥长度为 256b，因为 `cbc` 填充存在[填充攻击](https://www.packetmania.net/2020/12/01/AES-CBC-PaddingOracleAttack/)因此不建议选择

#### 加密格式化分区

因为默认使用的 `aes-xts-512` 加密，这里使用 `-s 256` 来指定使用 256b 密钥

```shell
cryptsetup luksFormat -s 256 /dev/nvme0n1p4
```

输入全大写 `YES`，然后输入加密密码并验证密码，等待一会儿就完成了磁盘加密

![格式化分区截图](/images/uploads/pasted-image-20220510213907.png "格式化分区截图")

#### 打开加密的分区

使用 `cryptsetup open` 打开加密的分区，这里的 `archlinux` 是解密之后的磁盘映射名（可自定义）

```shell
cryptsetup open /dev/nvme0n1p4 archlinux
```

输入正确的密码解密后就可以在 `/dev/mapper/` 目录下看到磁盘映射文件了，解密映射文件可以被格式化、挂载就像正常的块文件一样

```shell
ls /dev/mapper/
```

![查看磁盘映射文件截图](/images/uploads/pasted-image-20220510214404.png "查看磁盘映射文件截图")

#### 查看加密分区

```shell
cryptsetup status /dev/mapper/archlinux
```

![加密分区信息截图](/images/uploads/pasted-image-20220510214631.png "加密分区信息截图")

## 配置 Btrfs 文件系统

### 格式化磁盘映射为 btrfs 文件系统

```shell
mkfs.btrfs /dev/mapper/archlinux
```

### 创建 btrfs 卷

```shell
mount /dev/mapper/archlinux /mnt

btrfs subvolume create /mnt/@
btrfs subvolume create /mnt/@tmp
btrfs subvolume create /mnt/@home
btrfs subvolume create /mnt/@swap
btrfs subvolume create /mnt/@var_log
btrfs subvolume create /mnt/@pacman_pkg
btrfs subvolume create /mnt/@snapshots

umount /mnt
```

### 挂载 btrfs 卷

```shell
mount -o noatime,ssd,space_cache=v2,compress=zstd,subvol=@ /dev/mapper/archlinux /mnt

mkdir -p /mnt/{boot,efi,home,var/log,var/cache/pacman/pkg,.snapshots,tmp,swap}

mount -o noatime,ssd,space_cache=v2,compress=zstd,subvol=@tmp /dev/mapper/archlinux /mnt/tmp
mount -o noatime,ssd,space_cache=v2,compress=zstd,subvol=@home /dev/mapper/archlinux /mnt/home
mount -o noatime,ssd,space_cache=v2,compress=zstd,subvol=@snapshots /dev/mapper/archlinux /mnt/.snapshots
mount -o noatime,ssd,space_cache=v2,compress=zstd,subvol=@var_log /dev/mapper/archlinux /mnt/var/log
mount -o noatime,ssd,space_cache=v2,compress=zstd,subvol=@pacman_pkg /dev/mapper/archlinux /mnt/var/cache/pacman/pkg
mount -o noatime,ssd,subvol=@swap /dev/mapper/archlinux /mnt/swap

mount /dev/nvme0n1p1 /mnt/efi
mount /dev/nvme0n1p2 /mnt/boot
```

`lsblk` 查看挂载结果

![lsblk挂载结果](/images/uploads/pasted-image-20220511163003.png "lsblk挂载结果")

### 对 /var/log/ 和 警用 CoW

```shell
chattr +C /mnt/var/log
```

## 安装 ArchLinux

### pacstrap 安装基础包

```shell
pacstrap /mnt base linux-zen linux-firmware neovim
```

### 安装微码

AMD

```shell
pacstrap /mnt amd-ucode
```

intel

```
pacstrap /mnt intel-ucode
```

### 生成 fstab 文件

```shell
genfstab -U /mnt >> /mnt/etc/fstab
```

### 进入 chroot 环境

```shell
arch-chroot /mnt
```

### 基础配置

参考 [Installation guide - ArchWiki](https://wiki.archlinux.org/title/installation_guide)

```shell
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
hwclock --systohc

nvim /etc/local.gen # 取消注释 en_US.UTF-8 zh_CN.UTF-8 zh_TW.UTF-8
locale-gen
nvim /etc/locale.conf # 添加 LANG=en_US.UTF-8

nvim /etc/vconsole.conf # 添加 KEYMAP=us
```

编辑 /etc/hosts

```shell
nvim /etc/hosts
```

```hosts
127.0.0.1    localhost
::1          localhost
127.0.1.1    star-laptop.localdomain    star-laptop
```

编辑 /etc/hostname

```shell
nvim /etc/hostname
```

```hosts
star-laptop
```

安装系统软件包

```shell
pacman -S grub efibootmgr networkmanager git reflector snapper grub-btrfs base-devel linux-zen-headers zsh sudo
```

### 启动配置

#### mkinitcpio.conf

编辑 

```shell
nvim /etc/mkinitcpio.conf
```

在 `MODULES` 中添加 `btrfs`

```conf
MODULES=(btrfs)
```

更改 `HOOKS`

```conf
HOOKS=(base systemd autodetect keyboard sd-vconsole modconf block sd-encrypt filesystems fsck)
```

#### crypttab.initramfs

复制 crypttab 到 crypttab.initramfs

```shell
cp /etc/crypttab /etc/crypttab.initramfs
```

编辑 `crypttab.initramfs`

```
nvim /etc/crypttab.initramfs
```

在 vim 中查看磁盘 UUID

```
:read !lsblk -o name,uuid
```

![磁盘UUID截图](/images/uploads/pasted-image-20220511154203.png "磁盘UUID截图")

然后填入以下内容并删除多余的内容

```
archlinux     UUID=<lsblk 显示的 root 分区磁盘的 UUID>    none
```

![crypttab.initramfs文件截图](/images/uploads/pasted-image-20220511161121.png "crypttab.initramfs文件截图")

#### 生成启动镜像

```shell
mkinitcpio -P
```

#### 安装 GRUB

```shell
grub-install --target=x86_64-efi --efi-directory=/efi
```

#### 编辑内核参数

```shell
nvim /etc/default/grub
```

```
GRUB_CMDLINE_LINUX_DEFAULT="root=/dev/mapper/archlinux"
```

![内核参数截图](/images/uploads/pasted-image-20220511155312.png "内核参数截图")

#### 生成 GRUB 配置文件

```shell
grub-mkconfig -o /boot/grub/grub.cfg
```

### 添加用户

```shell
useradd -mG wheel star
passwd star
```

使用 `visudo` 编辑 `/etc/sudoers` 运行 wheel 组用户可以使用 `sudo`

```shell
EDITOR=nvim visudo
```

![visudo编辑截图](/images/uploads/pasted-image-20220511155820.png "visudo编辑截图")

更换新默认 `shell`

```shell
chsh -s /bin/zsh star
```

### 配置 SWAP

创建 swapfile 并关闭 CoW 和压缩

```
touch /swap/swapfile
chmod 600 /swap/swapfile
truncate -s 0 /swap/swapfile
chattr +C /swap/swapfile
btrfs property set /swap/swapfile compression none # 无法执行
dd if=/dev/zero of=/swap/swapfile bs=1M count=16384 # 16G SWAP 
mkswap /swap/swapfile
swapon /swap/swapfile
```

编辑 `/etc/fstab` 在末尾添加

```fstab
/swap/swapfile         none         swap          sw          0 0
```

![/etc/fstab截图](/images/uploads/pasted-image-20220511233702.png "/etc/fstab截图")

使用 btrfs_map_physical 获取 btrfs swapfile 的偏移量

下载 btrfs_map_physical.c

```shell
curl -O https://raw.githubusercontent.com/osandov/osandov-linux/master/scripts/btrfs_map_physical.c

# China
curl -O https://ghproxy.com/https://raw.githubusercontent.com/osandov/osandov-linux/master/scripts/btrfs_map_physical.c
```

编译

```shell
gcc btrfs_map_physical.c -o btrfs_map_physical
```

获取 swapfile offset

```shell
physical_offset=$(./btrfs_map_physical /swap/swapfile | awk '{ if ($1==0) print $NF; }')
offset_pagesize=(`getconf PAGESIZE`)
offset=$(( physical_offset / offset_pagesize ))
echo $offset > offset.txt
```

编辑 `/etc/default/grub`

```
  GRUB_CMDLINE_LINUX_DEFAULT="root=/dev/mapper/archlinux resume_offset=2761984"
```

![/etc/default/grub截图](/images/uploads/pasted-image-20220512115505.png "/etc/default/grub截图")

重新生成 `grub.cfg`

```shell
grub-mkconfig -o /boot/grub/grub.cfg
```

### 退出 arch-chroot 取消挂载完成安装

```shell
exit
umount -R /mnt
cryptsetup close archlinux
reboot
```

## 快照策略配置

### 移除 /.snapshots 目录

```shell
sudo rm -r /.snapshots
```

### 创建 snapper 配置文件

```shell
sudo snapper -c root create-config /
sudo snapper -c home create-config /home/
```

### 重新挂载

```bash
mount -a
```

### 更改 snapper 配置文件

```shell
sudo nvim /etc/snapper/configs/root
sudo nvim /etc/snapper/configs/home
```

#### 设置允许访问的用户组

![设置允许访问的用户组截图](/images/uploads/pasted-image-20220512135502.png "设置允许访问的用户组截图")

#### 设置自动快照规则

![设置自动快照规则截图](/images/uploads/pasted-image-20220512135738.png "设置自动快照规则截图")


### 启用自动快照和自动快照清理

```shell
sudo systemctl enable --now snapper-timeline.timer
sudo systemctl enable --now snapper-cleanup.timer
```

### 开启 pacman 安装包自动打快照

首先确保已经安装了 yay

安装 `snap-pac-grub`

```shell
yay -S snap-pac-grub
```


### 安装 snapper-gui 工具 (可选)

```
yay -S snapper-gui 
```

## 参考

1.  [Btrfs (简体中文) - ArchWiki](https://wiki.archlinux.org/title/Btrfs_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87))
2. [Power management/Suspend and hibernate - ArchWiki](https://wiki.archlinux.org/title/Power_management/Suspend_and_hibernate#Hibernation_into_swap_file)
3.  [从 Manjaro 迁移到 Arch Linux | weirane’s blog](https://blog.ruo-chen.wang/2021/03/switch-from-manjaro-to-arch.html)
4.  [让系统更安全 - 系统分区加密 (Btrfs on LUKS) 操作实录 | ∩ω∩ Technology](https://nwn.moe/posts/btrfs-on-luks/)
5.  [(3) Arch Linux Install: January 2021 ISO With BTRFS & Snapshots - YouTub](https://www.youtube.com/watch?v=Xynotc9BKe8)
6.  [Deebble/arch-btrfs-install-guide: Arch Linux installation guide with btrfs and snapper](https://github.com/Deebble/arch-btrfs-install-guide)
7. [arch btrfs with encryption](https://seankhliao.com/blog/12020-11-08-arch-dm-crypt-btrfs/)
8. [swap - Can I have a swapfile on btrfs? - Ask Ubuntu](https://askubuntu.com/questions/1206157/can-i-have-a-swapfile-on-btrfs)