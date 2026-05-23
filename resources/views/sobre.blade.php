@extends('layouts.app')

@section('title', 'Sobre Nós - WebContabil')
@section('page', 'sobre')

@section('content')
    <main class="max-w-6xl mx-auto px-4 py-20">
        <h1 class="text-4xl font-bold theme-text-high mb-6">Sobre Nós</h1>
        <a href="/" class="inline-flex items-center gap-2 rounded-full px-5 py-3 bg-brand text-white hover:bg-brand-light transition mb-10">
            ← Voltar ao Início
        </a>
        <p class="text-lg theme-text-low leading-relaxed mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus euismod semper
            sapien, et lacinia lacus facilisis at. Sed in massa nec eros aliquet feugiat.
        </p>
        <p class="text-base theme-text-low leading-relaxed">
            Fusce sit amet libero sodales, volutpat arcu at, viverra diam. Morbi vitae
            faucibus mi. Integer commodo sem sit amet ex maximus, sed ullamcorper nibh
            tristique.
        </p>
    </main>
@endsection
