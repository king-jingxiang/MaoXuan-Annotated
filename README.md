# MaoXuan-Annotated

> **在线阅读**: [https://king-jingxiang.github.io/MaoXuan-Annotated/](https://king-jingxiang.github.io/MaoXuan-Annotated/)

## 致敬与简介

《毛泽东选集》是毛泽东思想的集中体现，是20世纪对中国乃至世界产生深远影响的著作。它不仅记录了中国革命的波澜壮阔，更蕴含着深刻的哲学思想、政治智慧和战略韬略。

毛泽东同志作为伟大的马克思主义者，伟大的无产阶级革命家、战略家、理论家，是马克思主义中国化的伟大开拓者。他领导中国人民彻底改变了自己命运和国家面貌，建立了新中国。本项目怀着对这位世纪伟人的崇高敬意，希望通过数字化整理与多模态技术，让这些经典著作在新的时代焕发出新的生命力，辅助大家更好地学习与研读。

## 项目介绍

本项目致力于对《毛泽东选集》进行数字化整理与多模态解读，旨在辅助个人学习与研究。项目不仅包含经过处理的原始文档，还利用先进的生成式 AI 模型生成了深度解读、可视化图表以及语音朗读资源。

## 资源列表

项目的主要资源位于 `public` 目录下，包含以下内容：

### 1. 原始文档 (`content`)
- **路径**: `public/content/毛泽东选集`
- **说明**: 处理过的一篇一篇的《毛泽东选集》原始 Markdown 文档。

### 2. 解读文本 (`interpretation`)
- **路径**: `public/content/毛泽东选集_解读`
- **说明**: 基于原始文档内容以及生成的两张配图（信息图与知识图解图），生成的深度解读文本。
- **模型**: 使用 `gemini-3-flash-preview` 模型生成。

### 3. 配图资源 (`images`)
- **路径**: `public/images`
- **说明**: 为每一篇文档生成的配图，包含以下两类：
  - **信息图**: 概括文章核心信息。
  - **知识图解图**: 解析文章的逻辑结构与知识点。
- **模型**: 使用 `gemini-3-pro-image-preview` 模型生成。

### 4. 音频资源 (`audio`)
- **路径**: `public/audio`
- **说明**: 基于生成的解读文本朗读生成的音频文件。
- **模型**: 使用 `gemini-2.5-pro-preview-tts` 模型生成。

### 5、[时间线](public/timeline.md)
- **路径**: `public/timeline.md`
- **说明**: 按照时间线组织的文章列表，展示文章的发展历程。

## 免责声明

1. **学习用途**: 本项目仅供个人学习和研究使用，严禁用于任何商业用途或其他非法用途。
2. **内容甄别**: 文档内容可能经过处理或存在过时情况，生成的内容（解读、图片、音频）由 AI 模型生成，可能存在偏差或错误。请读者在使用时谨慎甄别，并以官方出版物为准。
3. **无政治立场**: 本项目没有任何政治立场，仅作为技术探索与学习资料的整理。
4. **使用限制**: 请勿将本项目资源用于违反法律法规或社会公德的用途。


## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=king-jingxiang/MaoXuan-Annotated&type=date&legend=top-left)](https://www.star-history.com/#king-jingxiang/MaoXuan-Annotated&type=date&legend=top-left)